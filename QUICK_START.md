# 🚀 Quick Start Guide

## ✅ What You've Done

- [x] Created Supabase project
- [x] Added API keys to `.env` file
- [x] Added API keys to Vercel

## ⚠️ Critical: Database Migration

**Before testing, you MUST run the database migration:**

1. Go to your Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file: `supabase/migrations/001_initial_schema.sql`
5. Copy the **entire contents** of that file
6. Paste into Supabase SQL Editor
7. Click **Run** (or press Cmd+Enter)
8. You should see: "Success. No rows returned"

**Verify it worked:**
- Go to **Table Editor** in Supabase
- You should see 4 tables: `users`, `equipment`, `maintenance_events`, `maintenance_schedules`

## 📦 Install Dependencies

**If Node.js is installed:**
```bash
cd /Users/lucaswerlau/FleetUnite
npm install
```

**If Node.js is NOT installed:**
```bash
# Install Node.js first (choose one method):

# Option 1: Homebrew
brew install node

# Option 2: Download from nodejs.org
# Visit: https://nodejs.org/ and download LTS version

# Then install dependencies:
npm install
```

## 🧪 Test Locally

```bash
# Start development server
npm run dev

# Should open http://localhost:3000
```

**Test these:**
1. ✅ Login page loads
2. ✅ Can sign up (creates account)
3. ✅ Can log in
4. ✅ Dashboard loads
5. ✅ Navigation works

## 🚀 Deploy to Vercel

Since you've already added environment variables to Vercel:

1. **Push code to GitHub** (if not already)
2. **Import project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - Vercel should auto-detect Vite/React

3. **Verify environment variables:**
   - In Vercel project settings → Environment Variables
   - Should have:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Deploy!**
   - Vercel will auto-deploy
   - Your app will be live at `your-project.vercel.app`

## ⚙️ Supabase Auth Settings for Production

**Important:** Update Supabase redirect URLs for production:

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Under **Redirect URLs**, add:
   - `https://your-project.vercel.app/**`
   - `https://your-domain.com/**` (if using custom domain)
3. Update **Site URL** to your production URL
4. Save changes

## 🔍 Verify Everything Works

Run the verification script:
```bash
./verify-setup.sh
```

Or manually check:
- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env` file has real values (not placeholders)
- [ ] Database migration run in Supabase
- [ ] Supabase Auth redirect URLs configured
- [ ] Vercel environment variables set

## 🐛 Common Issues

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after editing `.env`

### "Row Level Security policy violation"
- **You MUST run the database migration!**
- Go to Supabase SQL Editor and run `001_initial_schema.sql`

### "Failed to fetch" in production
- Check Supabase redirect URLs include your Vercel domain
- Verify environment variables in Vercel are correct
- Check Supabase project is not paused

### Authentication not working
- Check Supabase Auth settings
- Verify redirect URLs match your domain
- Check Supabase Auth logs for errors

## 📝 Next Steps After Testing

Once everything works:

1. **Build Equipment CRUD** (Days 1-2)
   - Add/edit/delete equipment
   - Equipment detail page

2. **Build Maintenance Tracking** (Days 3-4)
   - Log maintenance
   - Maintenance schedules

3. **Build Predictive Logic** (Days 5-6)
   - Usage calculations
   - Next maintenance predictions

## 🆘 Need Help?

- Check `TESTING.md` for detailed testing guide
- Check `SETUP.md` for full setup instructions
- Check browser console (F12) for errors
- Check Supabase logs (Authentication → Logs)


