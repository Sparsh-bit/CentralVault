/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Note: Do not use output: 'export' if you want full dynamic Edge Runtime features.
    // Standard Next.js build is optimized for Cloudflare via their dedicated builder.
    images: {
        unoptimized: true,
        domains: ['img.youtube.com', 'i.vimeocdn.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    generateBuildId: async () => 'build-' + Date.now(),
    webpack: (config, { dev, isServer }) => {
        // Absolute root-cause fix for Cloudflare 25MB limit
        if (!dev) {
            config.cache = false;
        }
        return config;
    },
};

module.exports = nextConfig;
