-- =====================================================
-- PROFESSIONAL DATABASE INITIALIZATION (FIX)
-- =====================================================
-- This script will:
-- 1. Create the 'resources' table with all required columns.
-- 2. Setup high-security Row Level Security (RLS).
-- 3. Ensure the project is ready for the Vault application.

-- 1. Create Resources Table (High Integrity Setup)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    url TEXT,
    type TEXT NOT NULL DEFAULT 'note', -- 'link', 'note', 'task'
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
-- This is critical for privacy - users only see their own data
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 3. Define Access Policies
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Enable all access for owners" ON resources;
DROP POLICY IF EXISTS "Users can view own resources" ON resources;
DROP POLICY IF EXISTS "Users can create own resources" ON resources;
DROP POLICY IF EXISTS "Users can update own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON resources;

-- Comprehensive policy for all operations
CREATE POLICY "Enable all access for owners" ON resources
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_is_favorite ON resources(is_favorite);
CREATE INDEX IF NOT EXISTS idx_resources_is_archived ON resources(is_archived);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS tr_resources_updated_at ON resources;
CREATE TRIGGER tr_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- SUCCESS MESSAGE
DO $$
BEGIN
    RAISE NOTICE 'Vault Professional Database v1.0 Initialized Successfully';
END $$;
