# Cloudflare Pages Environment Variables Required

Add these to your Cloudflare Pages dashboard under Settings > Environment variables:

## Critical for Build Success:
- `NEXT_PRIVATE_LOCAL_WEBPACK_CACHE` = `0`
- `NEXT_PRIVATE_STANDALONE` = `true`

## Your Existing Variables (Keep These):
- `NEXT_PUBLIC_SUPABASE_URL` = `https://yowdbcrajdlcapundjqt.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2RiY3JhamRsY2FwdW5kanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzg5MTMsImV4cCI6MjA4MzcxNDkxM30.QzLpJInrkPt1P_h7gcVGhZujB4jNkf916nUeD85pfWk`

## How to Add:
1. Go to Cloudflare Pages Dashboard
2. Select your CentralVault project  
3. Go to Settings > Environment variables
4. Click "Add variable"
5. Add each variable for BOTH Production and Preview environments
6. Save and trigger a new deployment

This disables webpack caching at the environment level, which is required for the fix to work.
