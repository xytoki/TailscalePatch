import 'zx/globals';

if (os.platform() !== 'linux') {
    echo`>> Android build is only supported on Linux.`;
    process.exit(1);
}

const androidDir = path.resolve('./tailscale-android');
const tailscaleDir = path.resolve('./tailscale');

echo`>> Building Docker image for tailscale-android...`;
await $`make -C ${androidDir} docker-build-image`;

echo`>> Building tailscale-android release APK via Docker...`;
// Mount both tailscale-android and tailscale into the container.
// The go.mod replace directive points to ../tailscale, so tailscale
// must be at /build/tailscale inside the container.
const dockerImage = 'tailscale-android-build-amd64-041425-1';
await $`docker run --rm \
    -v ${androidDir}:/build/tailscale-android \
    -v ${tailscaleDir}:/build/tailscale \
    ${dockerImage} \
    /bin/bash -c "make clean && make tailscale-release-apk"`;

echo`>> Copying APK output...`;
await $`cp ${androidDir}/tailscale-release.apk ./tailscale-release.apk`;
echo`>> Done. Output: tailscale-release.apk`;
