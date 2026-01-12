
// PHASE 4 - Offline Sync Manager
// Handles saving resources when offline and syncing them when online.

import Dexie, { Table } from 'dexie';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 1. Define Offline Database Schema
export interface PendingResource {
    id?: number;
    title: string;
    content: string;
    url: string;
    timestamp: number;
}

class OfflineDB extends Dexie {
    pendingResources!: Table<PendingResource>;

    constructor() {
        super('CentralVaultOffline');
        this.version(1).stores({
            pendingResources: '++id, timestamp' // Auto-increment ID
        });
    }
}

export const db = new OfflineDB();

// 2. Sync Function (Call this when app loads or network returns)
export async function syncOfflineResources() {
    if (!navigator.onLine) return; // Still offline

    const pending = await db.pendingResources.toArray();
    if (pending.length === 0) return;

    console.log(`[Sync] Found ${pending.length} offline resources to sync...`);
    const supabase = createClientComponentClient();

    for (const resource of pending) {
        try {
            const { error } = await supabase.from('resources').insert({
                title: resource.title,
                content: resource.content,
                url: resource.url,
                type: resource.url ? 'video_link' : 'plain_text',
                // We let AI process it on the server side later or leave it for batch
            });

            if (!error) {
                // Remove from offline DB if successful
                if (resource.id) await db.pendingResources.delete(resource.id);
                console.log(`[Sync] Synced: ${resource.title}`);
            } else {
                console.error(`[Sync] Failed to sync ${resource.title}:`, error);
            }
        } catch (err) {
            console.error('[Sync] Error:', err);
        }
    }
}

// 3. Save Function (Use this in UI)
export async function saveResourceIdeally(data: { title: string, content: string, url: string }) {
    if (navigator.onLine) {
        // Online? Save directly to Supabase
        const supabase = createClientComponentClient();
        return await supabase.from('resources').insert({
            title: data.title,
            content: data.content,
            url: data.url,
            type: data.url ? 'video_link' : 'plain_text'
        });
    } else {
        // Offline? Save to IndexedDB
        await db.pendingResources.add({
            title: data.title,
            content: data.content,
            url: data.url,
            timestamp: Date.now()
        });
        return { error: null, data: 'Saved offline' };
    }
}
