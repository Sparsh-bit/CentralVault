/**
 * PHASE 2 - TypeScript Type Definitions
 * 
 * Shared types for AI enhancement features
 */

// =====================================
// DATABASE TYPES
// =====================================

export interface Resource {
    id: string;
    user_id: string;
    title: string;
    content?: string;
    url?: string;
    type: 'plain_text' | 'video_link';

    // Phase 1 - Manual fields
    category?: string;
    tags?: string[];

    // Phase 2 - AI suggestion fields
    ai_category?: string;
    ai_tags?: string[];
    ai_keywords?: string[];
    ai_confidence?: number;
    ai_processed: boolean;
    ai_processed_at?: string;
    ai_error?: string;

    created_at: string;
    updated_at: string;
}

export interface UserAIPreferences {
    user_id: string;
    ai_enabled: boolean;
    auto_process_new_resources: boolean;
    confidence_threshold: number;
    preferred_model: 'gemini-2.0-flash' | 'gemini-1.5-pro';
    max_tags: number;
    max_keywords: number;
    preferred_language: string;
    created_at: string;
    updated_at: string;
}

export interface AIProcessingJob {
    id: string;
    resource_id: string;
    user_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    priority: number;
    attempts: number;
    max_attempts: number;
    error_message?: string;
    error_code?: string;
    processing_metadata?: Record<string, unknown>;
    created_at: string;
    started_at?: string;
    completed_at?: string;
    next_retry_at?: string;
}

// =====================================
// API RESPONSE TYPES
// =====================================

export interface DetectResourceTypeResponse {
    type: 'video_link' | 'plain_text';
    confidence: number;
    platform?: 'youtube' | 'vimeo' | 'dailymotion' | 'twitch' | 'other';
    metadata?: {
        detectedUrl?: string;
        urlValid?: boolean;
    };
}

export interface VideoMetadata {
    title: string;
    description: string;
    thumbnail: string;
    duration?: number;
    author?: string;
    authorUrl?: string;
    platform: string;
    videoId?: string;
    embedUrl?: string;
}

export interface ExtractMetadataResponse {
    success: boolean;
    metadata?: VideoMetadata;
    error?: string;
}

export interface AISuggestion {
    category: string;
    tags: string[];
    keywords: string[];
    confidence: number;
    reasoning?: string;
}

export interface AISuggestResponse {
    success: boolean;
    suggestion?: AISuggestion;
    error?: string;
}

export interface BatchAnalyzeResponse {
    success: boolean;
    queued: number;
    skipped: number;
    estimated_time_seconds: number;
    job_ids?: string[];
    error?: string;
}

export interface ProcessQueueResponse {
    success: boolean;
    processed: number;
    failed: number;
    pending: number;
    errors?: string[];
}

// =====================================
// UI STATE TYPES
// =====================================

export interface AISuggestionState {
    loading: boolean;
    suggestion: AISuggestion | null;
    error: string | null;
    appliedFields: {
        category: boolean;
        tags: boolean;
        keywords: boolean;
    };
}

export interface ProcessingStatus {
    isProcessing: boolean;
    progress?: number;
    estimatedTimeRemaining?: number;
    currentStep?: string;
}

// =====================================
// HOOK RETURN TYPES
// =====================================

export interface UseAISuggestionsReturn {
    suggestion: AISuggestion | null;
    loading: boolean;
    error: string | null;
    fetchSuggestions: (input: string | { content: string; url?: string }, force?: boolean) => Promise<void>;
    applySuggestion: (field: 'category' | 'tags' | 'keywords') => void;
    clearSuggestions: () => void;
}

export interface UseUserAIPreferencesReturn {
    preferences: UserAIPreferences | null;
    loading: boolean;
    error: string | null;
    updatePreferences: (updates: Partial<UserAIPreferences>) => Promise<void>;
    toggleAI: () => Promise<void>;
}

export interface UseResourceProcessorReturn {
    processResource: (resourceId: string) => Promise<void>;
    batchProcess: (resourceIds: string[], reprocess?: boolean) => Promise<void>;
    processAllUnprocessed: () => Promise<void>;
    status: ProcessingStatus;
    error: string | null;
}

// =====================================
// COMPONENT PROPS TYPES
// =====================================

export interface AISuggestionCardProps {
    resourceId?: string;
    suggestion?: AISuggestion;
    currentCategory?: string;
    currentTags?: string[];
    onApplySuggestion?: (category: string, tags: string[], keywords: string[]) => void;
    onApplyCategory?: (category: string) => void;
    onApplyTags?: (tags: string[]) => void;
    onDismiss?: () => void;
}

export interface AISettingsPanelProps {
    userId?: string;
    onSave?: () => void;
}

export interface ProcessingStatusProps {
    resourceId: string;
    showDetails?: boolean;
}

export interface ManualOverrideControlsProps {
    aiSuggestion: AISuggestion | null;
    manualCategory?: string;
    manualTags?: string[];
    onCategoryChange: (category: string) => void;
    onTagsChange: (tags: string[]) => void;
    disabled?: boolean;
}
