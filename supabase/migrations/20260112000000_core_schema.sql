-- =====================================================
-- CORE SCHEMA: Professional Resource Management
-- =====================================================
-- Purpose: Initialize the core resources table with advanced features
-- Features: Categories, Manual Tagging, Favorites, Archive
-- =====================================================

-- 1. Create Resources Table (if not exists)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    url TEXT,
    type TEXT NOT NULL DEFAULT 'note',
    category TEXT DEFAULT 'Uncategorized',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies (Drop old ones if they exist to be clean)
DROP POLICY IF EXISTS "Users can view own resources" ON resources;
DROP POLICY IF EXISTS "Users can create own resources" ON resources;
DROP POLICY IF EXISTS "Users can update own resources" ON resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON resources;

CREATE POLICY "Users can view own resources"
  ON resources FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resources"
  ON resources FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON resources FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON resources FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources(user_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_favorite ON resources(is_favorite) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_resources_archived ON resources(is_archived);

-- 5. Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Clean up old AI tables/cols if they exist (Purge chatbot artifacts)
DROP TABLE IF EXISTS processing_queue CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Remove AI columns if they were added previously
ALTER TABLE resources 
  DROP COLUMN IF EXISTS ai_category,
  DROP COLUMN IF EXISTS ai_tags,
  DROP COLUMN IF EXISTS ai_keywords,
  DROP COLUMN IF EXISTS ai_confidence,
  DROP COLUMN IF EXISTS ai_processed,
  DROP COLUMN IF EXISTS ai_processed_at,
  DROP COLUMN IF EXISTS ai_error;

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'Core database schema successfully initialized';
  RAISE NOTICE 'AI artifacts purged';
END $$;
