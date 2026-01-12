/** @type {import('next').NextConfig} */

// SANITIZATION: Delete conflicting environment variables that might force Standalone mode
// This ensures that output: 'export' (Static Site) takes precedence over any dashboard settings
if (process.env.NEXT_PRIVATE_STANDALONE) {
    delete process.env.NEXT_PRIVATE_STANDALONE;
}

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
