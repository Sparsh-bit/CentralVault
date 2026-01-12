// Component: Professional Mobile-Responsive Resource Card
// Specialized for high-intensity resource management

import { ExternalLink, Hash, Clock, Star, Archive, Trash2, RotateCcw, FileText, Link as LinkIcon, CheckSquare, Share2 } from 'lucide-react';
import type { ResourceCardProps } from '@/lib/types';

export function ResourceCard({
  resource,
  onTrash,
  onRestore,
  onPermanentDelete,
  onToggleFavorite,
  onArchive,
  onClick
}: ResourceCardProps) {
  const displayCategory = resource.category || 'Uncategorized';
  const displayTags = resource.tags || [];
  const isDeleted = !!resource.deleted_at;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource.title,
          text: resource.content || '',
          url: resource.url || window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(resource.url || resource.content || resource.title);
      alert('Linked copied to clipboard!');
    }
  };

  const TypeIcon = () => {
    if (resource.type === 'link') return <LinkIcon size={14} />;
    if (resource.type === 'task') return <CheckSquare size={14} />;
    return <FileText size={14} />;
  };

  return (
    <div
      className={`resource-card group ${resource.is_favorite ? 'pinned' : ''} ${isDeleted ? 'opacity-50 grayscale' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick?.(resource)}
    >
      <div className="card-top">
        <div className="flex items-center gap-2">
          <div className={`type-dot ${resource.type === 'task' ? 'bg-orange-500' : resource.type === 'link' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
          <span className="category-label">{displayCategory}</span>
        </div>

        <div className="flex items-center gap-1">
          {isDeleted ? (
            <>
              <ActionButton onClick={() => onRestore(resource.id)} icon={<RotateCcw size={18} />} color="text-green-500" />
              <ActionButton onClick={() => onPermanentDelete(resource.id)} icon={<Trash2 size={18} />} color="text-red-500" />
            </>
          ) : (
            <>
              <ActionButton
                onClick={() => onToggleFavorite(resource.id, resource.is_favorite)}
                icon={<Star size={18} fill={resource.is_favorite ? "currentColor" : "none"} />}
                color={resource.is_favorite ? 'text-yellow-400' : 'text-gray-500'}
              />
              <ActionButton
                onClick={() => onArchive(resource.id)}
                icon={<Archive size={18} />}
                color={resource.is_archived ? 'text-indigo-400' : 'text-gray-500'}
              />
              <ActionButton onClick={handleShare} icon={<Share2 size={18} />} color="text-gray-500 hover:text-indigo-400" />
              <ActionButton onClick={() => onTrash(resource.id)} icon={<Trash2 size={18} />} color="text-gray-500 hover:text-red-400" />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 mt-4">
        <h3 className="card-title">
          {resource.url ? (
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5">
              {resource.title}
              <ExternalLink size={14} className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            resource.title
          )}
        </h3>

        {resource.content && (
          <p className="card-desc">
            {resource.content.substring(0, 140)}
            {resource.content.length > 140 && '...'}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {displayTags.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="tag-chip">
            <Hash size={10} className="text-gray-600" /> {tag}
          </span>
        ))}
      </div>

      <div className="card-footer mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-tighter text-gray-500">
            <Clock size={12} />
            {new Date(resource.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-tighter text-gray-500">
            <TypeIcon />
            {resource.type}
          </div>
        </div>
      </div>

      <style jsx>{`
        .resource-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 28px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }

        .resource-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(99, 102, 241, 0.3);
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .resource-card.pinned {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
          border-color: rgba(234, 179, 8, 0.2);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .type-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            box-shadow: 0 0 10px currentColor;
        }

        .category-label {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #6366f1;
          opacity: 0.8;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .card-desc {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-top: 8px;
        }

        .tag-chip {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #cbd5e1;
        }

        .card-footer {
            display: flex;
            justify-content: space-between;
        }
      `}</style>
    </div>
  );
}

function ActionButton({ icon, onClick, color }: { icon: React.ReactNode, onClick: () => void, color: string }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`p-2.5 rounded-xl transition-all hover:bg-white/10 active:scale-90 ${color}`}
    >
      {icon}
    </button>
  );
}
