/** @type {import('next').NextConfig} */
const nextConfig = {
    // Static export for Cloudflare Pages - this is the professional standard
    // for client-side apps with external APIs (like Supabase)
    output: 'export',
    distDir: 'out',

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

    // Trailing slash for better Cloudflare Pages compatibility
    trailingSlash: true,
};

module.exports = nextConfig;
