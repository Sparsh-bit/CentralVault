
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.centralvault.app',
    appName: 'Central Vault',
    webDir: 'public',
    server: {
        // Ideally, this points to your deployed Vercel URL for the live app
        // e.g., 'https://central-vault.vercel.app'
        // For local dev, you can use your local IP
        androidScheme: 'https',
        allowNavigation: [
            'central-vault.vercel.app', // Update with actual domain
            '*.supabase.co',
            '*.googleusercontent.com'
        ]
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#ffffff",
            showSpinner: false,
        },
    },
};

export default config;
