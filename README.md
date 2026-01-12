# 🚀 Central Vault - Professional Resource Manager

A premium, secure personal knowledge vault for managing links, notes, and tasks. Built with Next.js 14 and Supabase. **Zero AI Bloat. 100% Privacy.**

## ✨ Features

- **🎨 Premium Dark UI** - Glassmorphism design with smooth hardware-accelerated animations.
- **📁 Advanced Organization** - Multi-category support with hierarchical tagging.
- **⭐ Favorites & Pinning** - Keep your most important research at the top.
- **📥 Cold Storage (Archive)** - Clean up your workspace without losing data.
- **🗑️ Recycle Bin** - High-integrity soft-delete system with recovery options.
- **🔒 Enterprise Security** - Row-level security (RLS) ensures only you see your data.
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile.

## 🏃 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Initialize Database (CRITICAL)
If your Supabase instance is empty:
1. Go to your **Supabase Dashboard**.
2. Open the **SQL Editor**.
3. Copy the contents of `supabase/migrations/20260112000000_core_schema.sql`.
4. Run the query. This will create the `resources` table and set up all security policies.

### 4. Start Development
```bash
npm run dev
```

## 📁 Project Structure

```
Central Vault/
├── app/                    # Next.js app directory
│   ├── components/        # Professional UI components
│   ├── dashboard/        # Main vault interface
│   └── login/            # Authentication logic
├── lib/
│   └── types/            # Enterprise-grade type system
├── supabase/
│   └── migrations/       # Core database schema
└── .env.local           # Environment configuration
```

## 🔐 Security Architecture

- **Row Level Security (RLS):** Every row in the database is bound to a `user_id`. Access is strictly controlled via PostgreSQL policies.
- **Session-Based Auth:** Uses Supabase Auth Helpers for secure, cookie-based session management.
- **Data Integrity:** Primary keys are UUID-based for global uniqueness and security.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Typing:** TypeScript (Strict Mode)

## 🔧 Maintenance

### Build for Production
```bash
npm run build
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## 📄 License
All Rights Reserved.

---
**Built for efficiency, privacy, and speed.**
