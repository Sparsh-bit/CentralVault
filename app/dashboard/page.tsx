
/**
 * PROFESSIONAL MOBILE-FIRST DASHBOARD
 * Optimized for both Web and Future Native App conversion
 */

'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ResourceCard } from '@/app/components/resource-card';
import { DetailModal } from '@/app/components/DetailModal';
import {
    Search, Plus, LayoutGrid, LayoutList, LogOut,
    Link as LinkIcon, FileText, CheckSquare,
    Star, Archive, Inbox, Filter, ChevronDown, X, Trash2, Menu, Monitor
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Resource, ResourceType } from '@/lib/types';

type SidebarTab = 'all' | 'favorites' | 'archived' | 'trash';

export default function Dashboard() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<SidebarTab>('all');
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const supabase = createClientComponentClient();
    const router = useRouter();

    // Resource Creation State
    const [showAddModal, setShowAddModal] = useState(false);
    const [resourceType, setResourceType] = useState<ResourceType>('link');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [category, setCategory] = useState('Uncategorized');
    const [tags, setTags] = useState('');

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [syncStatus, setSyncStatus] = useState<'synced' | 'error' | 'syncing'>('syncing');
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    // Detail View & Edit
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    setErrorDetails(`Auth Session Error: ${sessionError.message}`);
                    setSyncStatus('error');
                    return;
                }

                if (!session) {
                    router.push('/login');
                    return;
                }

                setUserId(session.user.id);
                setUserEmail(session.user.email || 'User');

                // Verbose Connection Check
                const { error: tableError } = await supabase.from('resources').select('id').limit(1);

                if (tableError) {
                    console.error('[Sync] Full Error Object:', tableError);
                    setErrorDetails(tableError.message);
                    setSyncStatus('error');

                    if (tableError.code === 'PGRST116' || (tableError as any).status === 404) {
                        alert('CRITICAL: Table "resources" not found. Go to Supabase SQL Editor and run the migration script.');
                    }
                } else {
                    setSyncStatus('synced');
                    setErrorDetails(null);
                }

                fetchResources();
            } catch (err: any) {
                console.error('[Dashboard] Critical Catch:', err);
                setErrorDetails(err.message || 'Unknown transport error');
                setSyncStatus('error');
            }
        };
        checkUser();

        // REAL-TIME SYNC: Listen for changes in the 'resources' table
        // This ensures the Web and Mobile apps stay in sync instantly
        const channel = supabase
            .channel('realtime:resources')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'resources'
            }, () => {
                fetchResources(); // Refresh data on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchResources = async () => {
        try {
            setLoading(true);
            setSyncStatus('syncing');
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                setErrorDetails(error.message);
                setSyncStatus('error');
                return;
            }
            setResources(data || []);
            setSyncStatus('synced');
            setErrorDetails(null);
        } catch (error: any) {
            setErrorDetails(error.message);
            setSyncStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateResource = async () => {
        if (!userId) return;
        if (resourceType === 'link' && !newUrl) return alert('URL is required');
        if (!title) return alert('Title is required');

        try {
            const tagArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

            const { error } = await supabase.from('resources').insert({
                user_id: userId,
                title,
                content: content || null,
                url: resourceType === 'link' ? newUrl : null,
                type: resourceType,
                category,
                tags: tagArray
            });

            if (error) throw error;

            setShowAddModal(false);
            resetForm();
            fetchResources();
        } catch (e: any) {
            console.error('[Create] Error details:', e);
            const msg = e.message || 'Check your internet connection and database setup.';
            alert(`FAILED TO SAVE: ${msg}\n\nHint: Verify your "resources" table exists in Supabase.`);
        }
    };

    const resetForm = () => {
        setNewUrl('');
        setTitle('');
        setContent('');
        setCategory('Uncategorized');
        setTags('');
    };

    // Beneficial Feature: Smart Content Detection (Non-AI)
    useEffect(() => {
        if (resourceType === 'link' && newUrl) {
            if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
                setCategory('Video');
                if (!tags.includes('youtube')) setTags(prev => prev ? `${prev}, youtube` : 'youtube');
            } else if (newUrl.includes('github.com')) {
                setCategory('Code');
                if (!tags.includes('github')) setTags(prev => prev ? `${prev}, github` : 'github');
            } else if (newUrl.includes('twitter.com') || newUrl.includes('x.com')) {
                setCategory('Social');
                if (!tags.includes('social')) setTags(prev => prev ? `${prev}, social` : 'social');
            } else if (newUrl.includes('linkedin.com')) {
                setCategory('Professional');
                if (!tags.includes('networking')) setTags(prev => prev ? `${prev}, networking` : 'networking');
            }
        }
    }, [newUrl, resourceType]);

    const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
        await supabase.from('resources').update({ is_favorite: !currentStatus }).eq('id', id);
        fetchResources();
    };

    const handleArchiveResource = async (id: string) => {
        const res = resources.find(r => r.id === id);
        await supabase.from('resources').update({ is_archived: !res?.is_archived }).eq('id', id);
        fetchResources();
    };

    const handleTrashResource = async (id: string) => {
        await supabase.from('resources').update({ deleted_at: new Date().toISOString(), is_favorite: false }).eq('id', id);
        fetchResources();
    };

    const handleRestoreResource = async (id: string) => {
        await supabase.from('resources').update({ deleted_at: null }).eq('id', id);
        fetchResources();
    };

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('Permanently delete?')) return;
        await supabase.from('resources').delete().eq('id', id);
        fetchResources();
    };

    const handleUpdateResource = async (id: string, updates: Partial<Resource>) => {
        await supabase.from('resources').update(updates).eq('id', id);
        fetchResources();
        setShowDetailModal(false);
    };

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.content?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
        const isDeleted = !!r.deleted_at;

        if (activeTab === 'trash') return matchesSearch && isDeleted;
        if (isDeleted) return false;

        if (activeTab === 'favorites') return matchesSearch && matchesCategory && r.is_favorite && !r.is_archived;
        if (activeTab === 'archived') return matchesSearch && matchesCategory && r.is_archived;

        return matchesSearch && matchesCategory && !r.is_archived;
    });

    const categories = ['All', ...Array.from(new Set(resources.filter(r => !r.deleted_at).map(r => r.category || 'Uncategorized')))];

    return (
        <div className="flex h-screen bg-[#050511] text-white font-sans overflow-hidden relative">

            {/* Sidebar (Desktop Drawer / Mobile Overlay) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a1a] border-r border-white/5 transition-transform duration-300
                lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="font-black text-white text-xl">V</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Vault</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-1 flex-1">
                        <SidebarItem icon={<Inbox size={20} />} label="All Content" active={activeTab === 'all'} onClick={() => { setActiveTab('all'); setIsSidebarOpen(false); }} />
                        <SidebarItem icon={<Star size={20} />} label="Favorites" active={activeTab === 'favorites'} onClick={() => { setActiveTab('favorites'); setIsSidebarOpen(false); }} />
                        <SidebarItem icon={<Archive size={20} />} label="Archives" active={activeTab === 'archived'} onClick={() => { setActiveTab('archived'); setIsSidebarOpen(false); }} />
                        <SidebarItem icon={<Trash2 size={20} />} label="Trash" active={activeTab === 'trash'} onClick={() => { setActiveTab('trash'); setIsSidebarOpen(false); }} />
                    </nav>

                    <div className="mb-6 space-y-3">
                        <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Mobile Vault</p>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">Get the full experience on Android and iOS.</p>
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase rounded-lg transition-colors">Download App</button>
                        </div>

                        <div className="p-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-purple-400 mb-1 tracking-widest flex items-center gap-2">
                                <Monitor size={10} /> Windows Companion
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">Native desktop performance and deep integration.</p>
                            <a
                                href="/downloads/CentralVault-Setup.exe"
                                className="block w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-center text-[10px] font-black uppercase rounded-lg transition-colors"
                            >
                                Download .exe
                            </a>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{userEmail}</p>
                                <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300">Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header */}
                <header className="h-16 lg:h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#050511]/80 backdrop-blur-xl z-40 sticky top-0">
                    <div className="flex items-center gap-3 lg:hidden">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-400">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg">Vault</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search vault..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                            <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-green-500 animate-pulse' : syncStatus === 'syncing' ? 'bg-yellow-500 animate-spin' : 'bg-red-500'}`} />
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                                {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing' : errorDetails || 'Connection Error'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        <button className="lg:hidden p-2 text-gray-400" onClick={() => {/* Focus search on mobile */ }}>
                            <Search size={20} />
                        </button>

                        <div className="hidden lg:flex items-center bg-white/5 rounded-xl p-1 border border-white/10 mx-2">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500'}`}><LayoutGrid size={16} /></button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500'}`}><LayoutList size={16} /></button>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-indigo-600 h-10 w-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2.5 rounded-full lg:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                            <Plus size={20} />
                            <span className="hidden lg:inline text-sm">New Item</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8">
                    {/* Mobile Search/Filter Row */}
                    <div className="lg:hidden flex gap-2 mb-6">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="bg-white/5 border border-white/10 p-3 rounded-2xl text-gray-400"><Filter size={18} /></button>
                    </div>

                    {/* Trash Actions Bar */}
                    {activeTab === 'trash' && filteredResources.length > 0 && (
                        <div className="mb-6 flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 text-red-400">
                                <Trash2 size={18} />
                                <span className="text-sm font-medium">{filteredResources.length} items in trash</span>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('Permanently delete all items in trash? This cannot be undone.')) {
                                        for (const res of filteredResources) {
                                            await handlePermanentDelete(res.id);
                                        }
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-medium transition-colors"
                            >
                                Empty Trash
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-white/5 rounded-[32px] animate-pulse" />)}
                        </div>
                    ) : (
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                            : "flex flex-col gap-4 max-w-5xl mx-auto w-full"
                        }>
                            {filteredResources.map(res => (
                                <ResourceCard
                                    key={res.id}
                                    resource={res}
                                    onTrash={handleTrashResource}
                                    onRestore={handleRestoreResource}
                                    onPermanentDelete={handlePermanentDelete}
                                    onToggleFavorite={handleToggleFavorite}
                                    onArchive={handleArchiveResource}
                                    onClick={(resource) => {
                                        setSelectedResource(resource);
                                        setShowDetailModal(true);
                                        setEditMode(false);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Bottom Navigation (Hidden on Desktop) */}
                <nav className="fixed bottom-0 inset-x-0 h-16 bg-[#0a0a1a]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 lg:hidden z-50">
                    <NavIcon icon={<Inbox size={20} />} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                    <NavIcon icon={<Star size={20} />} active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
                    <div className="mb-8 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-600/40 border-4 border-[#050511]" onClick={() => setShowAddModal(true)}>
                        <Plus size={24} className="text-white" />
                    </div>
                    <NavIcon icon={<Archive size={20} />} active={activeTab === 'archived'} onClick={() => setActiveTab('archived')} />
                    <NavIcon icon={<Trash2 size={20} />} active={activeTab === 'trash'} onClick={() => setActiveTab('trash')} />
                </nav>
            </main>

            {/* Modals (Responsive: Full Screen on Mobile) */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 backdrop-blur-md bg-black/60">
                    <div className="bg-[#0f0f1f] border border-white/10 w-full lg:max-w-xl lg:rounded-[40px] rounded-t-[40px] h-[90vh] lg:h-auto overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="sticky top-0 bg-[#0f0f1f] px-8 pt-8 pb-4 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold">New Capture</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                        </div>
                        <div className="px-8 pb-10 space-y-6">
                            <div className="flex p-1 bg-white/5 rounded-2xl">
                                <TypeBtn active={resourceType === 'link'} label="Link" onClick={() => setResourceType('link')} />
                                <TypeBtn active={resourceType === 'note'} label="Note" onClick={() => setResourceType('note')} />
                                <TypeBtn active={resourceType === 'task'} label="Task" onClick={() => setResourceType('task')} />
                            </div>
                            <div className="space-y-4">
                                {resourceType === 'link' && <input type="url" placeholder="URL" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-colors" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />}
                                <input type="text" placeholder="Title" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-colors font-bold" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Category" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none" value={category} onChange={(e) => setCategory(e.target.value)} />
                                    <input type="text" placeholder="Tags" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none" value={tags} onChange={(e) => setTags(e.target.value)} />
                                </div>
                                <textarea placeholder="Notes..." className="w-full bg-black/40 border border-white/10 rounded-[32px] px-5 py-4 h-40 outline-none focus:border-indigo-500 transition-colors resize-none" value={content} onChange={(e) => setContent(e.target.value)} />
                            </div>
                            <button onClick={handleCreateResource} className="w-full bg-white text-black py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all">Save to Vault</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail/Edit Modal */}
            <DetailModal
                resource={selectedResource}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedResource(null);
                }}
                onSave={handleUpdateResource}
            />
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
            {icon} {label}
        </button>
    );
}

function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`p-3 transition-all ${active ? 'text-indigo-400' : 'text-gray-500'}`}>
            {icon}
        </button>
    );
}

function TypeBtn({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${active ? 'bg-white text-black shadow-md' : 'text-gray-500'}`}>
            {label}
        </button>
    );
}
