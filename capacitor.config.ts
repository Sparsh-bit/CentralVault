import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.centralvault.app',
    appName: 'CentralVault',
    webDir: 'out', // Static export output directory
    server: {
        androidScheme: 'https',
        hostname: 'centralvault.pages.dev',
        allowNavigation: [
            'centralvault.pages.dev',
            '*.supabase.co',
            '*.googleusercontent.com'
        ]
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#050511', // Match your app's dark theme
            showSpinner: false,
        },
    },
};

export default config;
