# PHASE 2 - DEPLOYMENT GUIDE

## Production Deployment Checklist

### Prerequisites
- [ ] Phase 1 is deployed and stable
- [ ] Supabase project is accessible
- [ ] Gemini API key obtained
- [ ] Git repository is up to date

---

## Step 1: Database Migration

### 1.1 Connect to Supabase
```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref
```

### 1.2 Run Migrations
```bash
# Run migrations in order
npx supabase db push

# Or run individual migrations:
psql $DATABASE_URL -f supabase/migrations/20260111000001_add_ai_columns.sql
psql $DATABASE_URL -f supabase/migrations/20260111000002_create_user_preferences.sql
psql $DATABASE_URL -f supabase/migrations/20260111000003_create_processing_queue.sql
```

### 1.3 Verify Migrations
```sql
-- Check if AI columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resources' 
AND column_name LIKE 'ai_%';

-- Check if new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('user_ai_preferences', 'ai_processing_queue');

-- Verify RLS policies
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('user_ai_preferences', 'ai_processing_queue');
```

---

## Step 2: Deploy Edge Functions

### 2.1 Set Secrets
```bash
# Set Gemini API key
npx supabase secrets set GEMINI_API_KEY=your-gemini-api-key

# Set cron secret
npx supabase secrets set CRON_SECRET=$(openssl rand -base64 32)

# Optional: YouTube API key
npx supabase secrets set YOUTUBE_API_KEY=your-youtube-api-key

# Set configuration
npx supabase secrets set AI_PROCESSING_BATCH_SIZE=10
npx supabase secrets set AI_MAX_RETRIES=3
npx supabase secrets set AI_TIMEOUT_MS=30000
```

### 2.2 Deploy Functions
```bash
# Deploy all edge functions
npx supabase functions deploy detect-resource-type
npx supabase functions deploy extract-metadata
npx supabase functions deploy ai-suggest
npx supabase functions deploy process-queue
npx supabase functions deploy batch-analyze
```

### 2.3 Verify Deployments
```bash
# List deployed functions
npx supabase functions list

# Test a function
curl -X POST https://your-project.supabase.co/functions/v1/detect-resource-type \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

---

## Step 3: Set Up Cron Job

### 3.1 Configure pg_cron (Supabase Dashboard)

1. Go to Supabase Dashboard → Database → Extensions
2. Enable `pg_cron` extension
3. Run this SQL:

```sql
-- Create cron job to process queue every minute
SELECT cron.schedule(
  'process-ai-queue',
  '* * * * *', -- Every minute
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/process-queue',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'X-Cron-Secret', current_setting('app.settings.cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### 3.2 Store Cron Secret
```sql
-- Store cron secret in database settings
ALTER DATABASE postgres SET app.settings.cron_secret = 'your-cron-secret-here';
```

### 3.3 Verify Cron Job
```sql
-- Check active cron jobs
SELECT * FROM cron.job;

-- Check cron job run history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Step 4: Deploy Frontend

### 4.1 Update Environment Variables

Create `.env.local` from template:
```bash
cp .env.phase2.template .env.local
```

Fill in values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-cron-secret
```

### 4.2 Build and Test Locally
```bash
# Install dependencies
npm install

# Build
npm run build

# Test production build locally
npm start
```

### 4.3 Deploy to Hosting

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Manual:**
```bash
npm run build
# Upload .next folder to your hosting provider
```

---

## Step 5: Post-Deployment Verification

### 5.1 Smoke Tests

1. **Create a new resource** - Should trigger AI processing if auto-enabled
2. **Manually trigger AI** - Click "Analyze with AI" button
3. **Batch process** - Process multiple resources
4. **Check settings** - Toggle AI on/off
5. **View suggestions** - Verify AI suggestions appear correctly

### 5.2 Database Checks
```sql
-- Check AI processing stats
SELECT 
  COUNT(*) as total_resources,
  COUNT(*) FILTER (WHERE ai_processed = true) as processed,
  AVG(ai_confidence) as avg_confidence
FROM resources;

-- Check queue status
SELECT status, COUNT(*) 
FROM ai_processing_queue 
GROUP BY status;

-- Check user preferences
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE ai_enabled = true) as ai_enabled_count
FROM user_ai_preferences;
```

### 5.3 Monitor Logs
```bash
# Watch edge function logs
npx supabase functions logs ai-suggest --tail

# Watch all function logs
npx supabase functions logs --tail
```

---

## Step 6: Monitoring & Maintenance

### 6.1 Set Up Alerts

Monitor these metrics:
- Edge function error rates
- Queue processing latency
- Gemini API error rate
- Database query performance

### 6.2 Regular Maintenance

**Daily:**
- Check queue backlog (should be < 100)
- Monitor AI success rate (should be > 90%)

**Weekly:**
- Review failed jobs and error patterns
- Check Gemini API usage vs budget

**Monthly:**
- Clean up old queue jobs (automatic via function)
- Review and optimize AI prompts if needed

### 6.3 Backup Strategy

```bash
# Backup database (includes AI data)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Backup environment variables
cp .env.local .env.backup
```

---

## Rollback Plan

### If Phase 2 Causes Issues:

1. **Disable AI features immediately:**
```sql
UPDATE user_ai_preferences SET ai_enabled = false;
```

2. **Cancel pending queue jobs:**
```sql
UPDATE ai_processing_queue SET status = 'cancelled' WHERE status = 'pending';
```

3. **Disable cron job:**
```sql
SELECT cron.unschedule('process-ai-queue');
```

4. **Phase 1 continues working** - Manual category/tags still functional

### Full Rollback (if necessary):

```sql
-- Remove Phase 2 tables
DROP TABLE ai_processing_queue CASCADE;
DROP TABLE user_ai_preferences CASCADE;

-- Remove AI columns (optional, not recommended)
ALTER TABLE resources 
  DROP COLUMN ai_category,
  DROP COLUMN ai_tags,
  DROP COLUMN ai_keywords,
  DROP COLUMN ai_confidence,
  DROP COLUMN ai_processed,
  DROP COLUMN ai_processed_at,
  DROP COLUMN ai_error;
```

---

## Troubleshooting

### Edge Functions Not Working

1. Check secrets are set:
```bash
npx supabase secrets list
```

2. Check function logs:
```bash
npx supabase functions logs ai-suggest
```

3. Verify CORS headers in function responses

### Queue Not Processing

1. Check cron job is running:
```sql
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;
```

2. Manually trigger queue processor:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-queue \
  -H "X-Cron-Secret: your-cron-secret"
```

3. Check for stuck jobs:
```sql
SELECT * FROM ai_processing_queue 
WHERE status = 'processing' 
AND started_at < NOW() - INTERVAL '10 minutes';
```

### AI Suggestions Not Appearing

1. Check user preferences:
```sql
SELECT * FROM user_ai_preferences WHERE user_id = 'user-uuid';
```

2. Check resource AI status:
```sql
SELECT id, title, ai_processed, ai_error 
FROM resources 
WHERE user_id = 'user-uuid';
```

3. Check Gemini API key is valid

---

## Performance Optimization

### If Queue Processing is Slow:

1. Increase batch size:
```bash
npx supabase secrets set AI_PROCESSING_BATCH_SIZE=20
```

2. Adjust cron frequency (if queue backlog is large):
```sql
-- Process every 30 seconds instead of 1 minute
SELECT cron.schedule(
  'process-ai-queue',
  '*/30 * * * * *',
  $$ ... $$
);
```

### If Database Queries are Slow:

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM resources WHERE ai_processed = false;

-- Rebuild indexes if needed
REINDEX INDEX idx_resources_ai_unprocessed;
```

---

## Cost Management

### Monitor Gemini API Usage

- Track API calls per day
- Set budget alerts in Google Cloud Console
- Implement rate limiting if needed

### Estimate Costs

- Gemini 2.0 Flash: ~$0.075 per 1M input tokens
- Average resource analysis: ~500 tokens
- Cost per 1000 resources: ~$0.04

---

## Security Checklist

- [ ] Gemini API key stored as secret (not in code)
- [ ] Cron secret is randomly generated and secure
- [ ] RLS policies tested and verified
- [ ] Edge functions validate user authentication
- [ ] No sensitive data sent to Gemini API
- [ ] .env.local not committed to Git

---

## Success Criteria

Phase 2 deployment is successful when:

✅ All migrations run without errors
✅ All edge functions deployed and accessible
✅ Cron job processing queue every minute
✅ Users can enable/disable AI in settings
✅ AI suggestions appear correctly in UI
✅ Batch processing works for multiple resources
✅ No Phase 1 functionality broken
✅ Performance remains acceptable

---

**Deployment Time Estimate:** 2-3 hours
**Testing Time:** 1-2 hours
**Total:** 3-5 hours

*Last Updated: 2026-01-11*
