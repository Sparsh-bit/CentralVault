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
    webpack: (config) => {
        // Essential for Cloudflare Pages: Prevent large cache pack files
        // This solves the "Pages only supports files up to 25 MiB" error
        config.cache = false;
        return config;
    },
};

module.exports = nextConfig;
