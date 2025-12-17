# Fleet Unite - Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project
   - Wait for project to initialize (takes ~2 minutes)

2. **Get Your Credentials:**
   - In Supabase dashboard, go to **Settings** → **API**
   - Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (long string starting with `eyJ...`)

3. **Create Environment File:**
   ```bash
   # Create .env file in project root
   touch .env
   ```

4. **Add to .env file:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Set Up Database

1. **In Supabase Dashboard:**
   - Go to **SQL Editor**
   - Click **New Query**

2. **Run Migration:**
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

3. **Verify Tables Created:**
   - Go to **Table Editor** in Supabase
   - You should see 4 tables:
     - `users`
     - `equipment`
     - `maintenance_events`
     - `maintenance_schedules`

### 4. Configure Authentication

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Settings**
   - Under **Site URL**, add: `http://localhost:3000`
   - Under **Redirect URLs**, add: `http://localhost:3000/**`
   - Save changes

2. **Email Auth (Default):**
   - Email authentication is enabled by default
   - For development, emails will be sent (check spam folder)
   - Or use Supabase's email testing feature

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 6. Create Your First Account

1. Click **Sign up** on the login page
2. Enter your name, email, and password (min 6 characters)
3. Check your email for confirmation (or check Supabase Auth logs)
4. Sign in with your credentials
5. You'll be redirected to the dashboard

### 7. Test the App

1. **Dashboard should load** with empty state
2. **Navigation should work** (try clicking Equipment, Maintenance, Analytics)
3. **Sign out** should work (click your profile in sidebar)

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variable names start with `VITE_`
- Restart dev server after creating `.env`

### "Failed to fetch" or CORS errors
- Check Supabase URL is correct in `.env`
- Verify Supabase project is active (not paused)
- Check browser console for specific error

### "Row Level Security policy violation"
- Make sure you ran the migration SQL
- Check that RLS policies were created (in Supabase SQL Editor, run: `SELECT * FROM pg_policies;`)

### Authentication not working
- Verify email confirmation is set up in Supabase
- Check Supabase Auth logs for errors
- Make sure redirect URLs are configured

### Database connection issues
- Verify Supabase project is not paused
- Check network connection
- Try refreshing Supabase dashboard

## Next Steps

Once setup is complete:

1. ✅ You should be able to sign up and log in
2. ✅ Dashboard should load (empty state is normal)
3. 🚧 Next: Build equipment CRUD (add/edit/delete)
4. 🚧 Then: Maintenance tracking
5. 🚧 Finally: Predictive logic

## Production Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase (Backend)

- Already hosted - no deployment needed
- Update redirect URLs in Supabase Auth settings to your production domain

## Need Help?

Check the main README.md for more details on architecture and features.


