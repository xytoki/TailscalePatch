import 'zx/globals';

if (!(await fs.exists('./tailscale'))) {
    echo`>> Cloning tailscale.`;
    await $`git clone https://github.com/tailscale/tailscale.git`;
} else {
    echo`>> TailScale found. Skipping clone...`;
}

if (!(await fs.exists('./wireguard-go'))) {
    echo`>> Cloning wireguard-go...`;
    await $`git clone https://github.com/tailscale/wireguard-go.git`;
} else {
    echo`>> WireGuard found. Skipping clone.`;
}

echo`>> Parsing version of wireguard-go from tailscale...`;
const gomod = fs.readFileSync('tailscale/go.mod', 'utf8');
const wgGoVer = gomod.match(/github.com\/tailscale\/wireguard-go v(.*)/)[1];
const wgGoSha = wgGoVer.match(/-(.*)-(.*)/)[2];
echo`Found wireguard-go with commit sha ${wgGoSha}`;

echo`>> Checking out wireguard-go...`;
await cd('wireguard-go');
await $`git reset --hard`;
await $`git checkout ${wgGoSha}`;

echo`>> Applying patches...`;
await $`git apply ../patches/wireguard-go.patch`;
await cd('../tailscale');
await $`git reset --hard`;
await $`git apply ../patches/tailscale.patch`;

echo`>> Running go mod tidy...`;
await $`go mod tidy`;
