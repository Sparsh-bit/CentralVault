/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Ensure images from external sources (like YouTube thumbnails) work
    images: {
        domains: ['img.youtube.com', 'i.vimeocdn.com'],
    },
    // output: 'export', // Uncomment if doing purely static handling for Capacitor, but we use SSR for auth
};

module.exports = nextConfig;
