// Detail/Edit Modal for Resources
import { X, Edit2, Save, ExternalLink, Calendar, Tag, Folder } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Resource } from '@/lib/types';

interface DetailModalProps {
    resource: Resource | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Resource>) => Promise<void>;
}

export function DetailModal({ resource, isOpen, onClose, onSave }: DetailModalProps) {
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [editedTags, setEditedTags] = useState('');

    useEffect(() => {
        if (resource) {
            setEditedTitle(resource.title);
            setEditedContent(resource.content || '');
            setEditedCategory(resource.category || 'Uncategorized');
            setEditedTags(resource.tags?.join(', ') || '');
        }
    }, [resource]);

    if (!isOpen || !resource) return null;

    const handleSave = async () => {
        await onSave(resource.id, {
            title: editedTitle,
            content: editedContent,
            category: editedCategory,
            tags: editedTags.split(',').map(t => t.trim()).filter(Boolean)
        });
        setEditMode(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0a1a] border border-white/10 rounded-3xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-white/5">
                    <h2 className="text-2xl font-bold">Resource Details</h2>
                    <div className="flex items-center gap-2">
                        {!editMode ? (
                            <button
                                onClick={() => setEditMode(true)}
                                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="p-2.5 rounded-xl bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                <Save size={18} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Type Badge */}
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${resource.type === 'link' ? 'bg-indigo-500/20 text-indigo-400' :
                                resource.type === 'task' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {resource.type}
                        </span>
                        {resource.is_favorite && (
                            <span className="px-4 py-2 rounded-full text-xs font-bold uppercase bg-yellow-500/20 text-yellow-400">
                                Favorite
                            </span>
                        )}
                        {resource.is_archived && (
                            <span className="px-4 py-2 rounded-full text-xs font-bold uppercase bg-gray-500/20 text-gray-400">
                                Archived
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        {editMode ? (
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg font-semibold"
                            />
                        ) : (
                            <h3 className="text-2xl font-bold">{resource.title}</h3>
                        )}
                    </div>

                    {/* URL (for links) */}
                    {resource.url && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">URL</label>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                <ExternalLink size={16} />
                                <span className="truncate">{resource.url}</span>
                            </a>
                        </div>
                    )}

                    {/* Content */}
                    {(resource.content || editMode) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                            {editMode ? (
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                />
                            ) : (
                                <p className="text-gray-300 whitespace-pre-wrap">{resource.content}</p>
                            )}
                        </div>
                    )}

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Folder size={16} />
                            Category
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={editedCategory}
                                onChange={(e) => setEditedCategory(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        ) : (
                            <span className="px-3 py-1.5 bg-white/5 rounded-lg text-sm">{resource.category || 'Uncategorized'}</span>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Tag size={16} />
                            Tags
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={editedTags}
                                onChange={(e) => setEditedTags(e.target.value)}
                                placeholder="Separate tags with commas"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {resource.tags && resource.tags.length > 0 ? (
                                    resource.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-medium">
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No tags</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="pt-4 border-t border-white/5 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Created {new Date(resource.created_at).toLocaleDateString()}</span>
                        </div>
                        {resource.updated_at && resource.updated_at !== resource.created_at && (
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Updated {new Date(resource.updated_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
