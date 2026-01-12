/**
 * ENTERPRISE-LEVEL TYPE DEFINITIONS (CORE)
 * Central Vault - Shared Type System (No AI)
 */

// ============================================
// RESOURCE TYPES
// ============================================

export interface Resource {
    id: string;
    user_id: string;
    title: string;
    content?: string;
    url?: string;
    type: ResourceType;
    category?: string;
    tags?: string[];
    is_favorite: boolean;
    is_archived: boolean;
    deleted_at?: string;
    created_at: string;
    updated_at?: string;
}

export type ResourceType = 'link' | 'note' | 'task';

export interface CreateResourceInput {
    title: string;
    content?: string;
    url?: string;
    type: ResourceType;
    category?: string;
    tags?: string[];
    is_favorite?: boolean;
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export interface ResourceCardProps {
    resource: Resource;
    onTrash: (id: string) => Promise<void>;
    onRestore: (id: string) => Promise<void>;
    onPermanentDelete: (id: string) => Promise<void>;
    onToggleFavorite: (id: string, currentStatus: boolean) => Promise<void>;
    onArchive: (id: string) => Promise<void>;
    onClick?: (resource: Resource) => void;
}


// ============================================
// API RESPONSE TYPES
// ============================================

export interface SupabaseError {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateResourceFormData {
    type: ResourceType;
    title: string;
    content: string;
    url: string;
    dueDate?: string;
    category: string;
    tags: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData extends LoginFormData {
    confirmPassword: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type ViewMode = 'grid' | 'list';

// ============================================
// ERROR TYPES
// ============================================

export class ApplicationError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'ApplicationError';
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

export class NotFoundError extends ApplicationError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

// ============================================
// TYPE GUARDS
// ============================================

export function isResource(obj: unknown): obj is Resource {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'id' in obj &&
        'title' in obj &&
        'type' in obj
    );
}

export function isSupabaseError(error: unknown): error is SupabaseError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
    );
}

export function isApplicationError(error: unknown): error is ApplicationError {
    return error instanceof ApplicationError;
}
