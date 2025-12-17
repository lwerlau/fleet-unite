# Testing Guide - Fleet Unite MVP

## Prerequisites Check

Before testing, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Environment variables configured (`.env` file)

## Installation Steps

### 1. Install Node.js (if not installed)

**Option A: Using Homebrew (Recommended for macOS)**
```bash
brew install node
```

**Option B: Download from nodejs.org**
- Visit [nodejs.org](https://nodejs.org/)
- Download LTS version
- Install the .pkg file

**Option C: Using nvm (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts
```

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 2. Install Project Dependencies

```bash
cd /Users/lucaswerlau/FleetUnite
npm install
```

Expected output: Should install all packages without errors.

### 3. Set Up Supabase

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free tier is fine)
   - Create a new project
   - Wait for project initialization (~2 minutes)

2. **Get Credentials:**
   - In Supabase dashboard: **Settings** → **API**
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy **anon public key** (long string starting with `eyJ...`)

3. **Create .env File:**
   ```bash
   cd /Users/lucaswerlau/FleetUnite
   touch .env
   ```

4. **Add to .env:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   Replace with your actual values!

### 4. Run Database Migration

1. **In Supabase Dashboard:**
   - Go to **SQL Editor**
   - Click **New Query**

2. **Run Migration:**
   - Open file: `supabase/migrations/001_initial_schema.sql`
   - Copy entire contents
   - Paste into Supabase SQL Editor
   - Click **Run** (or Cmd+Enter)
   - Should see: "Success. No rows returned"

3. **Verify Tables:**
   - Go to **Table Editor**
   - Should see 4 tables:
     - ✅ `users`
     - ✅ `equipment`
     - ✅ `maintenance_events`
     - ✅ `maintenance_schedules`

### 5. Configure Authentication

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Settings**
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** Add `http://localhost:3000/**`
   - Click **Save**

## Testing Checklist

### Test 1: Start Development Server

```bash
npm run dev
```

**Expected:**
- Server starts on `http://localhost:3000`
- Browser opens automatically (or navigate manually)
- No console errors in terminal
- No errors in browser console (F12)

**If errors:**
- Check `.env` file exists and has correct values
- Restart dev server after creating `.env`
- Check Supabase project is active (not paused)

---

### Test 2: Login Page

**Navigate to:** `http://localhost:3000`

**Expected:**
- ✅ See "Fleet Unite" logo/title
- ✅ "Sign in to your account" heading
- ✅ Email input field
- ✅ Password input field
- ✅ "Sign in" button
- ✅ "Don't have an account? Sign up" link
- ✅ Mobile-responsive layout

**Test:**
- Try submitting empty form → Should show validation errors
- Try invalid credentials → Should show error message
- Click "Sign up" link → Should navigate to signup page

---

### Test 3: Signup Page

**Navigate to:** `http://localhost:3000/signup`

**Expected:**
- ✅ "Fleet Unite" logo/title
- ✅ "Create your account" heading
- ✅ Name input field
- ✅ Email input field
- ✅ Password input field (min 6 characters)
- ✅ "Sign up" button
- ✅ "Already have an account? Sign in" link

**Test:**
- Fill in all fields
- Use a real email (you'll need to verify it)
- Password must be 6+ characters
- Click "Sign up"
- **Expected:** Redirects to dashboard (or shows success message)

**Note:** Supabase may require email confirmation. Check:
- Your email inbox (check spam)
- Supabase Auth logs (Authentication → Logs in dashboard)

---

### Test 4: Dashboard (After Login)

**Navigate to:** `http://localhost:3000/dashboard` (should auto-redirect after login)

**Expected:**
- ✅ "Dashboard" heading
- ✅ "Overview of your equipment fleet" subtitle
- ✅ 4 stat cards:
  - Total Equipment: 0
  - In Good Condition: 0
  - Due Soon: 0
  - Overdue: 0
- ✅ "Your Equipment" section
- ✅ Empty state message: "No equipment"
- ✅ "Add Equipment" button
- ✅ Navigation sidebar (desktop) or bottom nav (mobile)

**Test Navigation:**
- Click "Equipment" → Should navigate to `/equipment`
- Click "Maintenance" → Should navigate to `/maintenance`
- Click "Analytics" → Should navigate to `/analytics`
- Click profile/sign out → Should sign out and redirect to login

---

### Test 5: Protected Routes

**Test:**
1. Sign out (if logged in)
2. Try to access `http://localhost:3000/dashboard` directly
3. **Expected:** Should redirect to `/login`

**Test:**
1. While logged in, try accessing `/login` or `/signup`
2. **Expected:** Should redirect to `/dashboard` (or stay on current page)

---

### Test 6: Mobile Responsiveness

**Test on Mobile/Tablet:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select mobile device (iPhone, etc.)

**Expected:**
- ✅ Login/signup forms are readable
- ✅ Dashboard is mobile-friendly
- ✅ Bottom navigation appears (not sidebar)
- ✅ Cards stack vertically
- ✅ Text is readable without zooming

---

### Test 7: Database Connection

**Test:**
1. Sign up a new account
2. Check Supabase dashboard → **Table Editor** → `users` table
3. **Expected:** Should see your new user record

**Test:**
1. In Supabase → **Authentication** → **Users**
2. **Expected:** Should see your user account

---

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution:**
- Check `.env` file exists in project root
- Verify variable names: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after creating/editing `.env`

### Issue: "Failed to fetch" or network errors

**Solution:**
- Verify Supabase URL is correct (no trailing slash)
- Check Supabase project is active (not paused)
- Check browser console for specific error
- Verify CORS settings in Supabase (should be auto-configured)

### Issue: "Row Level Security policy violation"

**Solution:**
- Make sure you ran the migration SQL
- Check RLS is enabled: In Supabase SQL Editor, run:
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
  ```
- All should show `true`

### Issue: Can't sign up / authentication fails

**Solution:**
- Check Supabase Auth settings
- Verify email confirmation settings
- Check Supabase Auth logs for errors
- Try using a different email
- Check password is 6+ characters

### Issue: Dashboard shows loading spinner forever

**Solution:**
- Check browser console for errors
- Verify user is authenticated (check Supabase Auth)
- Check network tab for failed requests
- Verify RLS policies allow user to read their own data

### Issue: Navigation doesn't work

**Solution:**
- Check browser console for React Router errors
- Verify all route components are imported correctly
- Check that Layout component wraps pages correctly

---

## Success Criteria

✅ All tests pass
✅ Can sign up and log in
✅ Dashboard loads without errors
✅ Navigation works (all pages accessible)
✅ Mobile layout is responsive
✅ Database connection works (user created in Supabase)
✅ Protected routes work (redirects when not logged in)

---

## Next Steps After Testing

Once all tests pass:

1. **Build Equipment CRUD:**
   - Equipment detail page
   - Add equipment form
   - Edit/delete functionality

2. **Build Maintenance Tracking:**
   - Log maintenance form
   - Maintenance history
   - Schedule management

3. **Build Predictive Logic:**
   - Usage calculations
   - Next maintenance predictions
   - Alert system

---

## Quick Test Commands

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Install dependencies
npm install

# Start dev server
npm run dev

# Check if .env exists
ls -la .env

# View .env (don't commit this!)
cat .env
```

---

## Reporting Issues

If you encounter issues:

1. Check browser console (F12) for errors
2. Check terminal for build/runtime errors
3. Check Supabase logs (Authentication → Logs)
4. Verify all setup steps were completed
5. Note the exact error message and when it occurs


