import 'zx/globals';
if (os.platform() !== 'linux') {
    echo`>> This script is only for Linux.`;
    exit(1);
}
let suffix = ''
if (process.argv.includes('--windows')) {
    // cross for windows amd64
    process.env.GOOS = 'windows';
    process.env.GOARCH = 'amd64';
    suffix = '.exe';
}
await cd('tailscale');
await fs.ensureDir('../dist');
await $`./build_dist.sh -v -o ../dist/tailscale${suffix} tailscale.com/cmd/tailscale`;
await $`./build_dist.sh -v -o ../dist/tailscaled${suffix} tailscale.com/cmd/tailscaled`;
