import 'zx/globals';
if (os.platform() !== 'linux') {
    echo`>> This script is only for Linux.`;
    exit(1);
}

echo`>> Getting latest tailscale MSI from pkgs.tailscale.com...`;
const res = await fetch('https://pkgs.tailscale.com/unstable/');
const html = await res.text();
const msiname = html.match(/"tailscale-setup-(.*)-amd64.msi"/)[0].replace(/"/g, '');
const msiurl = `https://pkgs.tailscale.com/unstable/${msiname}`;

echo`>> Found ${msiname}, downloading...`;
cd('dist');
await $`curl -L ${msiurl} -o ${msiname}`;

echo`>> Extracting cab data from ${msiname}...`;
await $`msiinfo extract ${msiname} cab1.cab > cab1.cab`;
await $`cabextract cab1.cab -d cab1`;

echo`>> Replacing tailscale.exe and tailscaled.exe...`;
await $`cp ./tailscale.exe cab1/ClientCmd`;
await $`cp ./tailscaled.exe cab1/Service`;

echo`>> Rebuilding cab1.cab...`;
let uselcab = false
try {
    await $`python3 ../scripts/makecab.py --test`;
} catch (p) {
    uselcab = true
}
if (uselcab) {
    echo`>> run pycab fail, use lcab instead. msi may be very large.`;
    await $`lcab -n cab1/* cab1.cab`;
} else {
    echo`>> pycab available. now the msi will be as small as usual.`;
    await $`python3 ../scripts/makecab.py cab1/ cab1.cab`;
}

echo`>> Rebuilding MSI file...`;
await $`msibuild ${msiname} -a cab1.cab cab1.cab`;

echo`>> Done.`