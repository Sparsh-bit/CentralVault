'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const handleCallback = async () => {
            // The Supabase client automatically handles the 'code' in the URL
            const { error } = await supabase.auth.getSession();

            if (!error) {
                router.push('/dashboard');
            } else {
                console.error('Auth error:', error.message);
                router.push('/login?error=callback_failed');
            }
        };

        handleCallback();
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-[#050511] flex flex-col items-center justify-center text-white p-4">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
            <h1 className="text-xl font-bold mb-2">Securing Session...</h1>
            <p className="text-gray-500 text-sm">Validating your credentials with CentralVault.</p>
        </div>
    );
}
