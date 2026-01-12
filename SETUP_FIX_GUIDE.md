# 🚨 COMPLETE FIX GUIDE - Central Vault Setup

## Current Problem
Your Supabase database has **0 tables** and the app is getting 404 errors because the `resources` table doesn't exist.

## ✅ SOLUTION (Follow These Steps EXACTLY)

### STEP 1: Verify Your Environment File

Open `d:\Central Notes\.env.local` and make sure it contains EXACTLY this:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yowdbcrajdlcapundjqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2RiY3JhamRsY2FwdW5kanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MjA1NzksImV4cCI6MjA1MjA5NjU3OX0.Uo7Hs6JvIGVIUlQGXXPnwmOzjxNZUYmWIgFcEZLqOBY
```

**IMPORTANT:** The key you gave me (`sb_publishable_...`) is NOT the correct format. You need the **ANON KEY** which starts with `eyJ...`

### STEP 2: Get Your REAL Anon Key

1. Go to: https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/settings/api
2. Look for **"anon" / "public"** key (NOT the service_role key)
3. Copy that key (it's very long, starts with `eyJ`)
4. Replace the key in your `.env.local` file

### STEP 3: Create the Database Table

1. Go to: https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/sql/new
2. Copy and paste this SQL:

```sql
-- Create Resources Table
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

-- Enable Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create Security Policy
CREATE POLICY "Users access own resources" ON resources
    FOR ALL USING (auth.uid() = user_id);

-- Create Indexes
CREATE INDEX idx_resources_user ON resources(user_id);
CREATE INDEX idx_resources_favorite ON resources(is_favorite);
```

3. Click **RUN** (bottom right)
4. You should see: "Success. No rows returned"

### STEP 4: Restart Your App

In your terminal:
1. Press `Ctrl+C` to stop the server
2. Run: `npm run dev`
3. Open: http://localhost:3000

### STEP 5: Verify It Works

- The red "CONNECTION ERROR" should turn to green "SYNCED"
- You should be able to create a new note/link/task
- Everything should save properly

---

## 🔍 If Still Not Working

Check your browser console (F12) and tell me the EXACT error message.

The most common issues are:
1. Wrong API key in `.env.local` (must start with `eyJ`)
2. Didn't run the SQL in Supabase
3. Typo in the Supabase URL
