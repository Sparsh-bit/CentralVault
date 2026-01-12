/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
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
    webpack: (config) => {
        // Professional resolution for Cloudflare 25MB limit: 
        // Completely disable filesystem caching during production builds.
        config.cache = false;
        return config;
    },
};

module.exports = nextConfig;
