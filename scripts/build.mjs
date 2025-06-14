import 'zx/globals';
if (os.platform() !== 'linux') {
    echo`>> This script is only for Linux.`;
    exit(1);
}
await cd('tailscale');
await fs.ensureDir('../dist');
if (process.argv.includes('--windows')) {
    // cross for windows amd64
    process.env.GOOS = 'windows';
    process.env.GOARCH = 'amd64';
    await $`TS_USE_TOOLCHAIN=1 ./build_dist.sh -v -o ../dist/tailscale.exe tailscale.com/cmd/tailscale`;
    await $`TS_USE_TOOLCHAIN=1 ./build_dist.sh -v -o ../dist/tailscaled.exe tailscale.com/cmd/tailscaled`;
} else {
    $.env = {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
    };
    const target = process.argv.includes('--arm64') ? 'arm64' : 'amd64';
    await $`./tool/go run ./cmd/dist build linux/${target}/*`;
    cd('..');
    const distpkgs = await glob('tailscale/dist/*.*');
    for (const pkg of distpkgs) {
        const fpath = path.resolve(pkg);
        const fname = path.basename(fpath).split('_');
        fname[1] = 'patched';
        await fs.move(fpath, `dist/${fname.join('-')}`);
    }
}
