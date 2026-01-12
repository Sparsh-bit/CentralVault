
'use client';

import React from 'react';

export function GlowingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative group ${className}`}>
            {/* Light Gradient Blob behind */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur animate-tilt" />

            {/* Main Content */}
            <div className="relative h-full bg-black border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                {children}
            </div>
        </div>
    );
}
