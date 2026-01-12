'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Link from 'next/link';
import { ArrowRight, Vault, Share2, Zap, Lock, Database } from 'lucide-react';
import nextDynamic from 'next/dynamic';
import { GlowingCard } from './components/GlowingCard';
import { useState, useEffect } from 'react';

const ThreeScene = nextDynamic(() => import('./components/ThreeScene').then(mod => mod.ThreeScene), {
    ssr: false,
});

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="min-h-screen text-white overflow-x-hidden relative">
            {/* 3D Background */}
            {mounted && <ThreeScene />}

            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none -z-10" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Vault className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            CentralVault
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="flex-1 space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-gray-300">System Online v4.0</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Knowledge Hub</span>, <br />
                            Professional Grade.
                        </h1>

                        <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                            Organize links, notes, and tasks in one secure space.
                            Professional tools for serious research and archiving.
                            Zero bloat. Absolute privacy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/signup"
                                className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
                            >
                                Start Vaulting
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/login"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm"
                            >
                                See Demo
                            </Link>
                        </div>
                    </div>

                    {/* Visual/Spline Placeholder (or just space for the 3D background to shine) */}
                    <div className="flex-1 w-full relative h-[500px] flex items-center justify-center">
                        {/* We rely on the ThreeScene background, but we can add floating cards here */}
                        <div className="relative w-80 h-96 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform rotate-[-6deg] animate-float hover:rotate-0 transition-transform duration-500 shadow-2xl skew-y-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Share2 className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <div className="h-2 w-24 bg-white/20 rounded mb-1"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5"></div>
                                <div className="h-2 w-full bg-white/10 rounded"></div>
                                <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-500/30">Work</span>
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs border border-blue-500/30">Project</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-20 right-10 w-72 h-80 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transform rotate-[6deg] animate-float-delayed shadow-2xl skew-y-1 z-[-1]">
                            {/* Second card content */}
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="py-24 border-t border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16">Intelligence Built In</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <GlowingCard>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <Database className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Universal Capture</h3>
                            <p className="text-gray-400 leading-relaxed">Share directly from Instagram, YouTube, or Chrome. We handle the rest.</p>
                        </GlowingCard>

                        <GlowingCard>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Pro Tagging</h3>
                            <p className="text-gray-400 leading-relaxed">Multi-dimensional tagging system to organize complex datasets with ease.</p>
                        </GlowingCard>

                        <GlowingCard>
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                                <Vault className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Cold Storage</h3>
                            <p className="text-gray-400 leading-relaxed">Archive old projects without deleting them. Keep your workspace lean and focused.</p>
                        </GlowingCard>
                    </div>
                </div>
            </section>

            {/* Mobile App Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Cross-Platform</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Take Your Vault Anywhere.</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        Our upcoming mobile app connects directly to your vault in real-time.
                        Capture insights on the go and find them instantly on your desktop.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all cursor-not-allowed grayscale">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-xl font-bold">A</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-gray-500 uppercase font-black">Coming to</p>
                                <p className="text-sm font-bold">App Store</p>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all cursor-not-allowed grayscale">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-xl font-bold">P</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] text-gray-500 uppercase font-black">Coming to</p>
                                <p className="text-sm font-bold">Google Play</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                    © 2026 CentralVault. All systems operational.
                </div>
            </footer>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </div>
    );
}
