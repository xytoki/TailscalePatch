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

await cd('./tailscale');
await $`git reset --hard`;
await $`git apply ../patches/tailscale.patch`;

// await cd('../tailscale-android');
// await $`git reset --hard 8d6922285da6c8f95593132f9909f6e6eeedd4d8`;
// await $`git apply ../patches/tailscale-android.patch`;

// echo`>> Running go mod tidy for tailscale-android...`;
// await cd('../tailscale-android');
// await $`go mod tidy`;
