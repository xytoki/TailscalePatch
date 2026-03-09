import 'zx/globals';

// if windows
if (os.platform() === 'win32') {
    $.shell = 'powershell.exe';
    $.prefix = ''
}

if (!(await fs.exists('./tailscale'))) {
    echo`>> Cloning tailscale.`;
    await $`git clone https://github.com/tailscale/tailscale.git`;
} else {
    echo`>> TailScale found. Skipping clone...`;
}

if (!(await fs.exists('./tailscale-android'))) {
    echo`>> Cloning tailscale-android.`;
    await $`git clone https://github.com/tailscale/tailscale-android.git`;
} else {
    echo`>> TailScale-android found. Skipping clone...`;
}

echo`>> Patching tailscale...`;
await cd('./tailscale');
await $`git reset --hard`;
await $`git apply --3way ../patches/tailscale.patch`;

echo`>> Patching tailscale-android...`;
await cd('../tailscale-android');
await $`git reset --hard`;
await $`git apply --3way ../patches/tailscale-android.patch`;

echo`>> Adding go.mod replace for tailscale-android...`;
// Add replace directive so tailscale-android uses the patched tailscale
await $`go mod edit -replace=tailscale.com=../tailscale`;
