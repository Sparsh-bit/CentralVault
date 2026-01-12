# PHASE 2 - API REFERENCE

Complete API documentation for Phase 2 AI Enhancement features.

---

## Authentication

All endpoints require authentication via Supabase Auth.

**Headers Required:**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
```

Get access token:
```javascript
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session.access_token;
```

---

## Edge Functions

### 1. Detect Resource Type

Automatically detect if input is a video link or plain text.

**Endpoint:** `POST /functions/v1/detect-resource-type`

**Request Body:**
```typescript
{
  content?: string;  // Text content to analyze
  url?: string;      // URL to detect
}
```

**Response:**
```typescript
{
  type: 'video_link' | 'plain_text';
  confidence: number;  // 0.0 to 1.0
  platform?: 'youtube' | 'vimeo' | 'dailymotion' | 'twitch' | 'other';
  metadata?: {
    detectedUrl?: string;
    urlValid?: boolean;
  };
}
```

**Example:**
```javascript
const { data } = await supabase.functions.invoke('detect-resource-type', {
  body: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
});

console.log(data);
// {
//   type: 'video_link',
//   confidence: 0.95,
//   platform: 'youtube',
//   metadata: { detectedUrl: '...', urlValid: true }
// }
```

**Error Codes:**
- `400` - Missing required parameters
- `401` - Not authenticated
- `500` - Internal server error

---

### 2. Extract Video Metadata

Extract title, description, thumbnail, and other metadata from video URLs.

**Endpoint:** `POST /functions/v1/extract-metadata`

**Request Body:**
```typescript
{
  url: string;                                          // Video URL
  platform?: 'youtube' | 'vimeo' | 'other';  // Optional platform hint
}
```

**Response:**
```typescript
{
  success: boolean;
  metadata?: {
    title: string;
    description: string;
    thumbnail: string;
    duration?: number;      // In seconds
    author?: string;
    authorUrl?: string;
    platform: string;
    videoId?: string;
    embedUrl?: string;
  };
  error?: string;
}
```

**Example:**
```javascript
const { data } = await supabase.functions.invoke('extract-metadata', {
  body: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
});

console.log(data.metadata);
// {
//   title: 'Rick Astley - Never Gonna Give You Up',
//   description: '...',
//   thumbnail: 'https://...',
//   platform: 'youtube',
//   videoId: 'dQw4w9WgXcQ'
// }
```

**Supported Platforms:**
- YouTube (oEmbed + optional API)
- Vimeo (oEmbed)
- Generic URLs (Open Graph meta tags)

**Error Codes:**
- `400` - Invalid URL
- `401` - Not authenticated
- `404` - Video not found
- `500` - Extraction failed

---

### 3. AI Suggest

Generate AI-powered category, tags, and keywords for a resource.

**Endpoint:** `POST /functions/v1/ai-suggest`

**Request Body:**
```typescript
{
  resource_id: string;  // UUID of the resource
  force?: boolean;      // Bypass AI preferences check (default: false)
}
```

**Response:**
```typescript
{
  success: boolean;
  suggestion?: {
    category: string;
    tags: string[];
    keywords: string[];
    confidence: number;  // 0.0 to 1.0
    reasoning?: string;
  };
  error?: string;
}
```

**Example:**
```javascript
const { data } = await supabase.functions.invoke('ai-suggest', {
  body: { resource_id: '123e4567-e89b-12d3-a456-426614174000' }
});

console.log(data.suggestion);
// {
//   category: 'Technology',
//   tags: ['AI', 'Machine Learning', 'Tutorial'],
//   keywords: ['artificial intelligence', 'neural networks', ...],
//   confidence: 0.87,
//   reasoning: 'Content focuses on machine learning concepts...'
// }
```

**Behavior:**
- Checks user AI preferences before processing (unless `force: true`)
- Automatically updates resource with AI suggestions
- Uses Gemini 2.0 Flash for fast processing

**Error Codes:**
- `400` - Missing resource_id
- `401` - Not authenticated
- `403` - AI disabled for user
- `404` - Resource not found
- `500` - AI processing failed

---

### 4. Batch Analyze

Queue multiple resources for AI processing.

**Endpoint:** `POST /functions/v1/batch-analyze`

**Request Body:**
```typescript
{
  resource_ids?: string[];      // Specific resource IDs
  all_unprocessed?: boolean;    // Process all unprocessed resources
  reprocess?: boolean;          // Reprocess even if already processed
}
```

**Response:**
```typescript
{
  success: boolean;
  queued: number;               // Number of jobs queued
  skipped: number;              // Number of resources skipped
  estimated_time_seconds: number;
  job_ids?: string[];
  error?: string;
}
```

**Example 1: Specific Resources**
```javascript
const { data } = await supabase.functions.invoke('batch-analyze', {
  body: {
    resource_ids: [
      '123e4567-e89b-12d3-a456-426614174000',
      '223e4567-e89b-12d3-a456-426614174001'
    ]
  }
});

console.log(data);
// { success: true, queued: 2, skipped: 0, estimated_time_seconds: 10 }
```

**Example 2: All Unprocessed**
```javascript
const { data } = await supabase.functions.invoke('batch-analyze', {
  body: { all_unprocessed: true }
});

console.log(data);
// { success: true, queued: 15, skipped: 0, estimated_time_seconds: 75 }
```

**Limits:**
- Maximum 100 resources per batch
- Duplicate jobs are automatically skipped
- Jobs are processed asynchronously by queue worker

**Error Codes:**
- `400` - Invalid request (missing parameters or batch too large)
- `401` - Not authenticated
- `403` - AI disabled for user
- `500` - Queue error

---

### 5. Process Queue

Background worker to process AI jobs from queue (cron-triggered).

**Endpoint:** `POST /functions/v1/process-queue`

**Authentication:** Requires `X-Cron-Secret` header or service role key

**Request:** None (internal)

**Response:**
```typescript
{
  success: boolean;
  processed: number;    // Jobs completed in this run
  failed: number;       // Jobs that failed
  pending: number;      // Jobs still in queue
  errors?: string[];
}
```

**Example (Manual Trigger):**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-queue \
  -H "X-Cron-Secret: your-cron-secret"
```

**Configuration:**
- Runs every 1 minute via pg_cron
- Processes up to 10 jobs per run (configurable)
- Concurrent processing with row-level locking
- Automatic retry with exponential backoff

**Error Codes:**
- `401` - Unauthorized (invalid cron secret)
- `500` - Processing error

---

## Database Functions

### enqueue_ai_processing

Add a resource to the AI processing queue.

**Signature:**
```sql
enqueue_ai_processing(
  p_resource_id UUID,
  p_user_id UUID,
  p_priority INTEGER DEFAULT 0
) RETURNS UUID
```

**Example:**
```sql
SELECT enqueue_ai_processing(
  '123e4567-e89b-12d3-a456-426614174000',
  auth.uid(),
  1  -- Higher priority
);
```

**Returns:** Job ID (UUID)

---

### get_next_ai_job

Get next pending job from queue (with row locking).

**Signature:**
```sql
get_next_ai_job() RETURNS ai_processing_queue
```

**Example:**
```sql
SELECT * FROM get_next_ai_job();
```

**Returns:** Next pending job or NULL if queue empty

---

### complete_ai_job

Mark a job as completed.

**Signature:**
```sql
complete_ai_job(p_job_id UUID) RETURNS VOID
```

**Example:**
```sql
SELECT complete_ai_job('job-uuid');
```

---

### fail_ai_job

Mark a job as failed (with retry logic).

**Signature:**
```sql
fail_ai_job(
  p_job_id UUID,
  p_error_message TEXT,
  p_error_code TEXT DEFAULT NULL
) RETURNS VOID
```

**Example:**
```sql
SELECT fail_ai_job(
  'job-uuid',
  'Gemini API timeout',
  'TIMEOUT'
);
```

**Behavior:**
- If attempts < max_attempts: schedules retry with exponential backoff
- If attempts >= max_attempts: marks as permanently failed

---

### cleanup_old_queue_jobs

Remove old completed/failed jobs (retention: 7 days).

**Signature:**
```sql
cleanup_old_queue_jobs() RETURNS INTEGER
```

**Example:**
```sql
SELECT cleanup_old_queue_jobs();
-- Returns: 42 (number of deleted jobs)
```

---

### get_or_create_user_ai_preferences

Get user preferences or create defaults if not exist.

**Signature:**
```sql
get_or_create_user_ai_preferences(p_user_id UUID) RETURNS user_ai_preferences
```

**Example:**
```sql
SELECT * FROM get_or_create_user_ai_preferences(auth.uid());
```

---

## Database Tables

### resources (Phase 2 Extensions)

New AI-related columns added to existing Phase 1 table:

```sql
ai_category TEXT                    -- AI-suggested category
ai_tags TEXT[]                      -- AI-suggested tags array
ai_keywords TEXT[]                  -- AI-extracted keywords
ai_confidence NUMERIC(3,2)          -- Confidence score (0.00-1.00)
ai_processed BOOLEAN                -- Processing completed flag
ai_processed_at TIMESTAMPTZ         -- Processing timestamp
ai_error TEXT                       -- Error message if failed
```

**Query Examples:**

```sql
-- Get resources with high-confidence AI suggestions
SELECT * FROM resources 
WHERE ai_confidence > 0.8 
AND ai_processed = true;

-- Search by AI keywords
SELECT * FROM resources 
WHERE ai_keywords && ARRAY['machine learning', 'tutorial'];

-- Get unprocessed resources
SELECT * FROM resources 
WHERE ai_processed = false;
```

---

### user_ai_preferences

Per-user AI configuration.

**Schema:**
```sql
user_id UUID PRIMARY KEY            -- User reference
ai_enabled BOOLEAN                  -- Master AI toggle
auto_process_new_resources BOOLEAN  -- Auto-process on create
confidence_threshold NUMERIC(3,2)   -- Min confidence (0.00-1.00)
preferred_model TEXT                -- Gemini model selection
max_tags INTEGER                    -- Max tags to suggest
max_keywords INTEGER                -- Max keywords to extract
preferred_language TEXT             -- Language preference
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

**Query Examples:**

```sql
-- Get user preferences
SELECT * FROM user_ai_preferences WHERE user_id = auth.uid();

-- Update preferences
UPDATE user_ai_preferences 
SET ai_enabled = true, auto_process_new_resources = true
WHERE user_id = auth.uid();

-- Count users with AI enabled
SELECT COUNT(*) FROM user_ai_preferences WHERE ai_enabled = true;
```

---

### ai_processing_queue

Async job queue for AI processing.

**Schema:**
```sql
id UUID PRIMARY KEY
resource_id UUID                    -- Resource reference
user_id UUID                        -- User reference
status ai_job_status                -- pending|processing|completed|failed|cancelled
priority INTEGER                    -- Higher = more urgent
attempts INTEGER                    -- Retry count
max_attempts INTEGER                -- Max retry limit
error_message TEXT                  -- Error details
error_code TEXT                     -- Error classification
processing_metadata JSONB           -- Extra data
created_at TIMESTAMPTZ
started_at TIMESTAMPTZ
completed_at TIMESTAMPTZ
next_retry_at TIMESTAMPTZ          -- Scheduled retry time
```

**Query Examples:**

```sql
-- Get user's queue status
SELECT status, COUNT(*) 
FROM ai_processing_queue 
WHERE user_id = auth.uid()
GROUP BY status;

-- Get failed jobs with errors
SELECT resource_id, error_message, attempts
FROM ai_processing_queue
WHERE status = 'failed' AND user_id = auth.uid();

-- Monitor queue backlog
SELECT COUNT(*) FROM ai_processing_queue WHERE status = 'pending';
```

---

## Views

### ai_queue_stats

Aggregate queue statistics per user.

**Schema:**
```sql
user_id UUID
pending_count INTEGER
processing_count INTEGER
completed_count INTEGER
failed_count INTEGER
avg_processing_time_seconds NUMERIC
last_job_created_at TIMESTAMPTZ
```

**Query Example:**
```sql
SELECT * FROM ai_queue_stats WHERE user_id = auth.uid();
```

---

## Realtime Subscriptions

### Subscribe to Queue Changes

```javascript
const channel = supabase
  .channel('queue_updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'ai_processing_queue',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Queue updated:', payload);
    }
  )
  .subscribe();
```

### Subscribe to Resource AI Updates

```javascript
const channel = supabase
  .channel('resource_ai_updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'resources',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      if (payload.new.ai_processed) {
        console.log('AI processing complete:', payload.new);
      }
    }
  )
  .subscribe();
```

---

## Rate Limits

- **Gemini API:** 60 requests per minute (configurable)
- **Edge Functions:** 500 requests per minute per authenticated user
- **Database:** No artificial limits (PostgreSQL connection pooling)

---

## Error Handling

### Standard Error Response

```typescript
{
  success: false,
  error: string,       // Human-readable error message
  code?: string,       // Error code for programmatic handling
  details?: any        // Additional error context
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `AI_DISABLED` | User has AI disabled | Enable AI in settings |
| `RESOURCE_NOT_FOUND` | Resource doesn't exist | Verify resource ID |
| `GEMINI_API_ERROR` | Gemini API failed | Check API key, retry |
| `QUEUE_FULL` | Too many pending jobs | Wait for processing |
| `INVALID_URL` | URL format invalid | Verify URL format |
| `RATE_LIMIT` | Too many requests | Implement backoff |

---

## Best Practices

### 1. Check AI Preferences First

```javascript
const { data: preferences } = await supabase
  .from('user_ai_preferences')
  .select('ai_enabled')
  .eq('user_id', userId)
  .single();

if (!preferences?.ai_enabled) {
  // Show enable AI prompt
}
```

### 2. Handle Async Processing

```javascript
// Queue the job
const { data } = await supabase.functions.invoke('batch-analyze', {
  body: { resource_ids: ids }
});

// Poll for completion
const pollStatus = async () => {
  const { data: jobs } = await supabase
    .from('ai_processing_queue')
    .select('status')
    .in('id', data.job_ids);
  
  const allDone = jobs.every(j => 
    j.status === 'completed' || j.status === 'failed'
  );
  
  if (!allDone) {
    setTimeout(pollStatus, 5000); // Poll every 5s
  }
};

pollStatus();
```

### 3. Implement Error Retry

```javascript
const analyzeWithRetry = async (resourceId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data } = await supabase.functions.invoke('ai-suggest', {
        body: { resource_id: resourceId }
      });
      
      if (data.success) return data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 2 ** i * 1000)); // Exponential backoff
    }
  }
};
```

---

## Performance Tips

1. **Batch Operations:** Use `batch-analyze` instead of individual `ai-suggest` calls
2. **Confidence Threshold:** Higher threshold = fewer low-quality suggestions
3. **Indexes:** AI columns are indexed for fast search
4. **Caching:** Consider caching AI suggestions client-side
5. **Async UI:** Show loading states, don't block user

---

*API Reference Version: 2.0.0*  
*Last Updated: 2026-01-11*
