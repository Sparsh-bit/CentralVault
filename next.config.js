/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Enable Static Export for maximum Cloudflare compatibility
    output: 'export',
    // Ensure images from external sources (like YouTube thumbnails) work
    images: {
        unoptimized: true, // Required for static export
        domains: ['img.youtube.com', 'i.vimeocdn.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    },
    webpack: (config) => {
        config.cache = false;
        return config;
    },
    generateBuildId: async () => {
        return 'build-' + Date.now();
    },
};

module.exports = nextConfig;
