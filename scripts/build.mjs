import 'zx/globals';
if (os.platform() !== 'linux') {
    echo`>> This script is only for Linux.`;
    exit(1);
}
// cross for windows amd64
process.env.GOOS = 'windows';
process.env.GOARCH = 'amd64';
await cd('tailscale');
await fs.ensureDir('../dist');
await $`./build_dist.sh -v -o ../dist/tailscale.exe tailscale.com/cmd/tailscale`;
await $`./build_dist.sh -v -o ../dist/tailscaled.exe tailscale.com/cmd/tailscaled`;
