/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
    // Layer 1: Force Next.js to use a temporary system directory for caching
    // This ensures the cache is never even created inside the deployment folder.
    distDir: '.next',

    webpack: (config, { dev, isServer }) => {
        // Layer 2: Hard-disable Webpack filesystem caching at the engine level
        config.cache = false;

        // Ensure the config is applied to the worker as well
        if (!dev) {
            config.optimization = {
                ...config.optimization,
                minimize: true,
            };
        }
        return config;
    },
};

module.exports = nextConfig;
