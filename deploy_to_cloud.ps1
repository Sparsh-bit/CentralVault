# ===========================================
# CENTRAL VAULT - Production Deployment
# ===========================================
# This script securely deploys your vault to Supabase Cloud
# Run this ONCE after initial setup

$ErrorActionPreference = "Stop"

Write-Host "`n=========================================="  -ForegroundColor Cyan
Write-Host "   🚀 CENTRAL VAULT DEPLOYMENT WIZARD   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Function to check command success
function Test-CommandSuccess {
    param($LastExitCode, $Step)
    if ($LastExitCode -ne 0) {
        Write-Host "❌ Failed at: $Step" -ForegroundColor Red
        Write-Host "Please check the error above and try again." -ForegroundColor Yellow
        exit 1
    }
    else {
        Write-Host "✅ $Step completed successfully`n" -ForegroundColor Green
    }
}

# Step 1: Link Project
Write-Host "`n📡 STEP 1: Linking to Supabase Cloud..." -ForegroundColor Yellow
Write-Host "   Project: yowdbcrajdlcapundjqt"
npx supabase link --project-ref yowdbcrajdlcapundjqt
Test-CommandSuccess $LASTEXITCODE "Project linking"

# Step 2: Push Database Schema
Write-Host "`n🗄️  STEP 2: Deploying Database Schema..." -ForegroundColor Yellow
Write-Host "   This creates tables and security policies"
npx supabase db push
Test-CommandSuccess $LASTEXITCODE "Database schema deployment"

# Step 3: Sync Secrets
Write-Host "`n🔑 STEP 3: Syncing API Keys..." -ForegroundColor Yellow
Write-Host "   Uploading GEMINI_API_KEY from .env.local"
npx supabase secrets set --env-file .env.local
Test-CommandSuccess $LASTEXITCODE "Secret synchronization"

# Step 4: Deploy Edge Functions
Write-Host "`n⚡ STEP 4: Deploying AI Functions..." -ForegroundColor Yellow
Write-Host "   Deploying ai-chat function"
npx supabase functions deploy ai-chat
Test-CommandSuccess $LASTEXITCODE "Edge function deployment"

# Success!
Write-Host "`n===========================================" -ForegroundColor Green
Write-Host "   ✨ DEPLOYMENT SUCCESSFUL! ✨" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host "`n🎉 Your Central Vault is live!" -ForegroundColor Cyan
Write-Host "📊 Database: Protected with Row-Level Security" -ForegroundColor Gray
Write-Host "🤖 AI Chat: Ready to answer questions" -ForegroundColor Gray
Write-Host "🔐 API Keys: Securely synced" -ForegroundColor Gray
Write-Host "`n[INFO] If services show 'Unhealthy' in Supabase dashboard," -ForegroundColor Yellow
Write-Host "       wait 3-5 minutes for them to initialize." -ForegroundColor Yellow

Read-Host -Prompt "`nPress Enter to exit"
