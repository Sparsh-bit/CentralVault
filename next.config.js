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

    // THE ARCHITECTURAL FIX:
    // This tells Next.js and Webpack to NEVER write internal system cache files to the disk.
    // This removes the "0.pack" file from the build process entirely.
    webpack: (config, { isServer, dev }) => {
        if (!dev) {
            // Force Webpack to only use memory for its internal operations
            config.cache = false;

            // Industrial Chunk Splitting: 
            // Ensures heavy libraries are split into tiny pieces (<20MB) compatible with Cloudflare
            config.optimization.splitChunks = {
                chunks: 'all',
                maxSize: 20000000, // 20MB limit per file
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                },
            };
        }
        return config;
    },
};

module.exports = nextConfig;
