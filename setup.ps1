# ============================================
# AUTOMATED SUPABASE SETUP SCRIPT
# ============================================
# This script will help you set up your database

Write-Host "`n=== CENTRAL VAULT - AUTOMATED SETUP ===" -ForegroundColor Cyan
Write-Host "This will help you fix the connection errors.`n" -ForegroundColor Yellow

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "`nCreating .env.local file..." -ForegroundColor Yellow
    
    $envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yowdbcrajdlcapundjqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: You need to add your ANON KEY!" -ForegroundColor Yellow
    Write-Host "1. Go to: https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/settings/api" -ForegroundColor White
    Write-Host "2. Copy the 'anon' / 'public' key (starts with eyJ...)" -ForegroundColor White
    Write-Host "3. Replace YOUR_ANON_KEY_HERE in .env.local with that key`n" -ForegroundColor White
    
    # Open the file for editing
    notepad .env.local
    
    Write-Host "`nPress Enter after you've added your key..." -ForegroundColor Yellow
    Read-Host
}

# Read and validate environment variables
Write-Host "`n📋 Checking environment configuration..." -ForegroundColor Cyan

$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "NEXT_PUBLIC_SUPABASE_URL=(.+)") {
    $url = $matches[1].Trim()
    Write-Host "✅ URL found: $url" -ForegroundColor Green
}
else {
    Write-Host "❌ ERROR: NEXT_PUBLIC_SUPABASE_URL not found in .env.local" -ForegroundColor Red
    exit 1
}

if ($envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)") {
    $key = $matches[1].Trim()
    if ($key -eq "YOUR_ANON_KEY_HERE" -or $key.Length -lt 100) {
        Write-Host "ERROR: Invalid ANON KEY in .env.local" -ForegroundColor Red
        Write-Host "   Your key should be very long and start with 'eyJ'" -ForegroundColor Yellow
        Write-Host "`n   Get it from: https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/settings/api`n" -ForegroundColor White
        exit 1
    }
    $keyPreview = $key.Substring(0,20)
    Write-Host "ANON KEY found ($keyPreview...)" -ForegroundColor Green
}
else {
    Write-Host "❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Environment configuration looks good!" -ForegroundColor Green

# Show SQL setup instructions
Write-Host "`n📊 DATABASE SETUP REQUIRED" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nYou need to create the 'resources' table in Supabase:" -ForegroundColor Yellow
Write-Host "`n1. Open this link in your browser:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/sql/new" -ForegroundColor Cyan

Write-Host "`n2. Copy the SQL from this file:" -ForegroundColor White
Write-Host "   d:\Central Notes\supabase\migrations\20260112000001_professional_fix.sql" -ForegroundColor Cyan

Write-Host "`n3. Paste it into the SQL Editor and click RUN" -ForegroundColor White

Write-Host "`n4. You should see 'Success. No rows returned'" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`nWould you like me to:" -ForegroundColor Yellow
Write-Host "1. Open the SQL Editor in your browser" -ForegroundColor White
Write-Host "2. Open the SQL file to copy" -ForegroundColor White
Write-Host "3. Skip and start the dev server" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White

$choice = Read-Host "`nEnter your choice (1-4)"

switch ($choice) {
    "1" {
        Start-Process "https://supabase.com/dashboard/project/yowdbcrajdlcapundjqt/sql/new"
        notepad "supabase\migrations\20260112000001_professional_fix.sql"
        Write-Host "`n✅ Opened SQL Editor and SQL file" -ForegroundColor Green
        Write-Host "Copy the SQL and run it, then press Enter to continue..." -ForegroundColor Yellow
        Read-Host
    }
    "2" {
        notepad "supabase\migrations\20260112000001_professional_fix.sql"
        Write-Host "`n✅ Opened SQL file" -ForegroundColor Green
        Write-Host "After running the SQL in Supabase, press Enter to continue..." -ForegroundColor Yellow
        Read-Host
    }
    "3" {
        Write-Host "`n⚠️  Make sure you've run the SQL in Supabase first!" -ForegroundColor Yellow
    }
    "4" {
        Write-Host "`nExiting..." -ForegroundColor Gray
        exit 0
    }
}

# Start the development server
Write-Host "`n🚀 Starting development server..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

# Clean build
if (Test-Path ".next") {
    Write-Host "Cleaning old build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

npm run dev
