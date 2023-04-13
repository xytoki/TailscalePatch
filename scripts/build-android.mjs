import 'zx/globals';
if (os.platform() !== 'linux') {
    echo`>> This script is only for Linux.`;
    exit(1);
}
await cd('tailscale-android');
await $`make tailscale-fdroid.apk`;
