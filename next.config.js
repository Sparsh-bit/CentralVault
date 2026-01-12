/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Ensure images from external sources (like YouTube thumbnails) work
    images: {
        domains: ['img.youtube.com', 'i.vimeocdn.com'],
    },
    // output: 'export', // Uncomment if doing purely static handling for Capacitor, but we use SSR for auth
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
};

module.exports = nextConfig;
