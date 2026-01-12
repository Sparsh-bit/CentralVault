'use client';

import { Monitor, Chrome, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InstallPage() {
    return (
        <div className="min-h-screen bg-[#050511] text-white">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0a0a1a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <span className="text-xl font-black">CV</span>
                        </div>
                        <span className="text-xl font-black">CentralVault</span>
                    </Link>
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
                        <Monitor className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-bold text-purple-400">Desktop Installation Guide</span>
                    </div>
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Install CentralVault
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Get the full desktop experience with offline support, native notifications, and seamless performance.
                    </p>
                </div>

                {/* Browser Selection */}
                <div className="mb-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <Chrome className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-2">Recommended Browser</h3>
                            <p className="text-gray-400 text-sm">
                                For the best experience, use <strong className="text-white">Google Chrome</strong> or <strong className="text-white">Microsoft Edge</strong>.
                                Other browsers may not support all installation features.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Installation Steps */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-black mb-8">Installation Steps</h2>

                    {/* Step 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-2xl font-black">
                                1
                            </div>
                            <h3 className="text-2xl font-bold">Open CentralVault in Your Browser</h3>
                        </div>
                        <p className="text-gray-400 mb-4 ml-16">
                            Navigate to <code className="px-2 py-1 bg-black/40 rounded text-purple-400 font-mono text-sm">https://centralvault.pages.dev</code> using Chrome or Edge.
                        </p>
                        <div className="ml-16 p-4 bg-black/40 border border-white/10 rounded-xl">
                            <p className="text-sm text-gray-500 mb-2">💡 Quick Tip</p>
                            <p className="text-sm text-gray-300">Make sure you're using the latest version of your browser for the best experience.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-2xl font-black">
                                2
                            </div>
                            <h3 className="text-2xl font-bold">Look for the Install Icon</h3>
                        </div>
                        <div className="ml-16 space-y-4">
                            <p className="text-gray-400">
                                In the address bar (where the URL is), you'll see an <strong className="text-white">install icon</strong>:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                                    <p className="text-sm font-bold mb-2 text-purple-400">Chrome</p>
                                    <p className="text-sm text-gray-300">Look for a <Monitor className="w-4 h-4 inline" /> monitor icon with a down arrow on the right side of the address bar.</p>
                                </div>
                                <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
                                    <p className="text-sm font-bold mb-2 text-blue-400">Edge</p>
                                    <p className="text-sm text-gray-300">Look for a <Download className="w-4 h-4 inline" /> plus (+) icon or app icon in the address bar.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-2xl font-black">
                                3
                            </div>
                            <h3 className="text-2xl font-bold">Click Install</h3>
                        </div>
                        <div className="ml-16 space-y-4">
                            <p className="text-gray-400 mb-4">
                                Click the install icon and then click <strong className="text-white">"Install"</strong> in the popup that appears.
                            </p>
                            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
                                <p className="text-sm font-bold mb-2">Alternative Method (If icon not visible):</p>
                                <ul className="text-sm text-gray-300 space-y-2">
                                    <li>• Click the <strong>three dots menu</strong> (⋮ or ⋯) in the top-right corner</li>
                                    <li>• Hover over <strong>"Save and share"</strong> (Chrome) or <strong>"Apps"</strong> (Edge)</li>
                                    <li>• Click <strong>"Install CentralVault"</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold">You're Done!</h3>
                        </div>
                        <div className="ml-16 space-y-4">
                            <p className="text-gray-400">
                                CentralVault will now:
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Open in its own window (no browser UI)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Appear in your Start Menu and Desktop</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Work offline with full functionality</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Update automatically when we release new features</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-16 p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl">
                    <h3 className="text-2xl font-bold mb-6">Why This Method?</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold mb-2 text-purple-400">✨ Modern & Secure</h4>
                            <p className="text-sm text-gray-300">Progressive Web Apps (PWAs) are the modern standard used by Twitter, Spotify, and Microsoft Teams.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 text-blue-400">🚀 Always Up-to-Date</h4>
                            <p className="text-sm text-gray-300">No manual updates needed. You'll always have the latest features automatically.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 text-green-400">💾 Lightweight</h4>
                            <p className="text-sm text-gray-300">Only ~5MB instead of 100MB+ for traditional desktop apps.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 text-orange-400">🔒 More Secure</h4>
                            <p className="text-sm text-gray-300">Runs in a sandboxed environment with enhanced security protections.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <a
                        href="https://centralvault.pages.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
                    >
                        Open CentralVault
                        <ArrowRight className="w-5 h-5" />
                    </a>
                    <p className="text-sm text-gray-500 mt-4">
                        Need help? <Link href="/login" className="text-purple-400 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
