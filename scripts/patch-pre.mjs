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

const repoRoot = process.cwd();
const tailscalePatches = (await glob('./patches/tailscale/*.patch')).sort().map((patchFile) => path.resolve(repoRoot, patchFile));
const tailscaleAndroidPatches = (await glob('./patches/tailscale-android/*.patch')).sort().map((patchFile) => path.resolve(repoRoot, patchFile));

if (tailscalePatches.length === 0) {
    throw new Error('No tailscale patch files found in ./patches/tailscale');
}
if (tailscaleAndroidPatches.length === 0) {
    throw new Error('No tailscale-android patch files found in ./patches/tailscale-android');
}

echo`>> Patching tailscale...`;
await cd('./tailscale');
if (await fs.exists('.git/rebase-apply')) {
    await $`git am --abort`;
}
await $`git reset --hard`;
await $`git am --3way ${tailscalePatches}`;

echo`>> Patching tailscale-android...`;
await cd('../tailscale-android');
if (await fs.exists('.git/rebase-apply')) {
    await $`git am --abort`;
}
await $`git reset --hard`;
await $`git am --3way ${tailscaleAndroidPatches}`;

echo`>> Adding go.mod replace for tailscale-android...`;
// Add replace directive so tailscale-android uses the patched tailscale
await $`go mod edit -replace=tailscale.com=../tailscale`;
