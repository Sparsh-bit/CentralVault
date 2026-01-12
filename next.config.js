// Layer 0: Kill the Webpack cache before the Next.js engine even starts
// This is the only way to stop the background workers on Cloudflare
process.env.NEXT_PRIVATE_LOCAL_WEBPACK_CACHE = '0';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
        domains: ['img.youtube.com', 'i.vimeocdn.com'],
    },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },

    webpack: (config, { dev }) => {
        if (!dev) {
            // Layer 1: Memory-only caching
            config.cache = false;

            // Layer 2: Aggressive small-chunk strategy
            // Cloudflare Pages works best with many small files instead of one big one
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 10000,
                maxSize: 15000000, // Hard limit 15MB to stay well under the 25MB threshold
            };
        }
        return config;
    },
};

module.exports = nextConfig;
