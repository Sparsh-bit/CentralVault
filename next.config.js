/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
    // Cloudflare Pages Native Integration Settings
    experimental: {
        // Disable webpack build worker to prevent cache file generation
        webpackBuildWorker: false,
    },
    webpack: (config, { isServer }) => {
        // Completely disable webpack's persistent caching
        // This is the industry standard for Cloudflare deployments
        config.cache = false;

        // Disable any cache plugins that might be active
        config.plugins = config.plugins.filter(
            plugin => plugin.constructor.name !== 'HardSourceWebpackPlugin'
        );

        return config;
    },
};

module.exports = nextConfig;
