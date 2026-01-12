# Cloudflare Pages Configuration for Static Export

## Build Settings (Update in Cloudflare Dashboard)

### Framework preset
- Set to: **Next.js (Static HTML Export)**
- Or set to: **None**

### Build command
```
npm run build
```

### Build output directory
```
out
```

### Environment Variables (Required)
Add these in Settings > Environment variables for **both Production and Preview**:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://yowdbcrajdlcapundjqt.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2RiY3JhamRsY2FwdW5kanF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzg5MTMsImV4cCI6MjA4MzcxNDkxM30.QzLpJInrkPt1P_h7gcVGhZujB4jNkf916nUeD85pfWk`

## Why This Works

Static export (`output: 'export'` in next.config.js) completely eliminates webpack's internal cache files. It generates only the essential HTML, CSS, and JavaScript files needed for deployment - no internal build artifacts, no cache files, no 26MB files.

This is the professional standard for client-side applications with external APIs like Supabase.
