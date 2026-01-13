
// Component: Professional Share Target
// Handles shared content from mobile apps or extensions
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Save, X, Loader2, Link as LinkIcon, FileText, ChevronDown, ChevronUp, Globe, Edit3, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ShareContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClientComponentClient();

    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [tags, setTags] = useState('');

    // UI State
    const [saving, setSaving] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [hostname, setHostname] = useState('');

    // 1. Check Auth & Parse Params
    useEffect(() => {
        const init = async () => {
            // Optimistic Auth Check: Don't wait too long if session exists in storage
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Double check if we can refresh session or if it's truly gone
                // Delay redirect slightly to allow potential restoration
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (!retrySession) {
                        const returnUrl = `/share?${searchParams.toString()}`;
                        router.push(`/login?return=${encodeURIComponent(returnUrl)}`);
                    } else {
                        setLoadingAuth(false);
                    }
                }, 1000);
            } else {
                setLoadingAuth(false);
            }

            const sharedTitle = searchParams.get('title') || '';
            const sharedText = searchParams.get('text') || '';
            const sharedUrl = searchParams.get('url') || '';

            let finalUrl = sharedUrl;
            let finalText = sharedText;

            // Smart Parse: If text contains a URL and no URL param is present
            if (!finalUrl && isUrl(sharedText)) {
                // Extract URL from text (simple regex for basic extraction)
                const urlMatch = sharedText.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                    finalUrl = urlMatch[0];
                    finalText = sharedText.replace(finalUrl, '').trim();
                } else {
                    finalUrl = sharedText;
                    finalText = '';
                }
            }

            setTitle(sharedTitle || (finalUrl ? 'Shared Link' : 'Shared Note'));
            setContent(finalText);
            setUrl(finalUrl);

            // Smart Category
            if (finalUrl) {
                try {
                    const host = new URL(finalUrl).hostname.replace('www.', '');
                    setHostname(host);
                    if (host.includes('instagram') || host.includes('youtube') || host.includes('tiktok')) setCategory('Video');
                    else if (host.includes('github') || host.includes('gitlab')) setCategory('Code');
                    else if (host.includes('twitter') || host.includes('x.com') || host.includes('linkedin')) setCategory('Social');
                    else setCategory('Link');

                    if (!sharedTitle) setTitle(`Saved from ${host}`);
                } catch (e) { /* ignore invalid url for host parsing */ }
            }
        };
        init();
    }, [searchParams]);

    const isUrl = (str: string) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('Session expired. Please log in again.');
                router.push('/login');
                return;
            }

            const tagArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

            // Add hostname as tag if exists
            if (hostname && !tagArray.includes(hostname)) tagArray.push(hostname);

            const { error } = await supabase.from('resources').insert({
                user_id: user.id,
                title: title,
                content: content,
                type: url ? 'link' : 'note',
                url: url || null,
                category: category,
                tags: tagArray
            });

            if (error) throw error;
            router.push('/dashboard?saved=true');
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save resource. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loadingAuth) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050511] text-white">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-4" />
                <p className="text-gray-400 font-medium animate-pulse">Authenticating...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-20 right-[-50px] w-64 h-64 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="px-6 py-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                        <Save size={20} className="text-indigo-400" />
                    </div>
                </div>
                <button onClick={() => router.push('/dashboard')} className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <X size={20} />
                </button>
            </header>

            <main className="flex-1 px-6 pb-24 flex flex-col z-10 max-w-lg mx-auto w-full justify-center">

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-1 overflow-hidden shadow-2xl"
                >
                    {/* Preview Section (if URL) */}
                    {url && (
                        <div className="bg-black/40 rounded-[28px] p-5 mb-1 border border-white/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                    {category === 'Video' ? <ImageIcon size={20} className="text-indigo-400" /> : <Globe size={20} className="text-indigo-400" />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white truncate pr-2">{title}</h3>
                                    <p className="text-xs text-gray-400 truncate">{url}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 border border-white/5 uppercase font-bold tracking-wider">{category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Comment Input */}
                    <div className="p-5">
                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block p-1">Add a Comment</label>
                        <textarea
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-transparent text-xl font-medium placeholder-gray-600 outline-none h-32 resize-none leading-relaxed"
                            placeholder="Type your thoughts here..."
                        />
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Edit Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm focus:border-indigo-500 transition-colors outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Edit Tags</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm focus:border-indigo-500 transition-colors outline-none"
                                        placeholder="Separate with commas"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle Details */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full py-3 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                        {showDetails ? (
                            <>Collapse Details <ChevronUp size={14} /></>
                        ) : (
                            <>Edit Details <ChevronDown size={14} /></>
                        )}
                    </button>
                </motion.div>

                {/* Info Text */}
                <p className="text-center text-xs text-gray-500 mt-6 px-4">
                    Content is automatically categorized as <span className="text-indigo-400 font-bold">{category}</span> based on source.
                </p>
            </main>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#050511] via-[#050511] to-transparent z-20">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full max-w-lg mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Save to Vault
                            <Save size={20} className="opacity-80" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div className="p-4 bg-[#050511] text-white">Initializing Capture...</div>}>
            <ShareContent />
        </Suspense>
    );
}
