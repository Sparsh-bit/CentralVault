
// Component: Professional Share Target
// Handles shared content from mobile apps or extensions
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Save, X, Loader2, Link as LinkIcon, FileText } from 'lucide-react';

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
    const [saving, setSaving] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 1. Check Auth & Parse Params
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const returnUrl = `/share?${searchParams.toString()}`;
                router.push(`/login?return=${encodeURIComponent(returnUrl)}`);
            } else {
                setIsAuthenticated(true);
            }

            const sharedTitle = searchParams.get('title') || '';
            const sharedText = searchParams.get('text') || '';
            const sharedUrl = searchParams.get('url') || '';

            let finalUrl = sharedUrl;
            let finalText = sharedText;

            if (!finalUrl && isUrl(sharedText)) {
                finalUrl = sharedText;
                finalText = '';
            }

            setTitle(sharedTitle);
            setContent(finalText);
            setUrl(finalUrl);
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
        if (!title && !url) return;
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const tagArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

            const { error } = await supabase.from('resources').insert({
                user_id: user?.id,
                title: title || (url ? 'Shared Link' : 'Shared Note'),
                content: content,
                type: url ? 'link' : 'note',
                url: url || null,
                category: category || 'Uncategorized',
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

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#050511]">
                <Loader2 className="animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050511] text-white flex flex-col">
            <header className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-[#0a0a1a]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Save size={16} />
                    </div>
                    <h1 className="text-lg font-bold">Quick Capture</h1>
                </div>
                <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </header>

            <main className="flex-1 p-6 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6 shadow-2xl">

                    {/* URL Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-1">Target URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-indigo-500 transition-colors outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-lg font-bold focus:border-indigo-500 transition-colors outline-none"
                            placeholder="Resource Heading"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-1">Notes</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm h-40 resize-none focus:border-indigo-500 transition-colors outline-none"
                            placeholder="Add your thoughts or snippets here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-1">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:border-indigo-500 transition-colors outline-none"
                                placeholder="e.g. Work, Tech"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 pl-1">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:border-indigo-500 transition-colors outline-none"
                                placeholder="coding, react..."
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="p-6 bg-[#0a0a1a] border-t border-white/5">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            <Save size={20} />
                            Commit to Vault
                        </>
                    )}
                </button>
            </footer>
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
