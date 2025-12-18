# Fleet Unite - Complete Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server

```bash
cd /Users/lucaswerlau/FleetUnite
npm run dev
```

The server will start on **http://localhost:3000**

### 2. Open in Browser

Navigate to: **http://localhost:3000**

---

## 📋 Step-by-Step Testing Checklist

### ✅ Phase 1: Authentication

**Test Sign Up:**
1. Click "Sign up" on login page
2. Enter:
   - Name: Your name
   - Email: your-email@example.com
   - Password: (min 6 characters)
3. Click "Sign up"
4. **Expected:** Redirects to dashboard

**Test Login:**
1. If already signed up, enter credentials
2. Click "Sign in"
3. **Expected:** Redirects to dashboard

**Test Protected Routes:**
1. Sign out
2. Try accessing `http://localhost:3000/dashboard` directly
3. **Expected:** Redirects to login page

---

### ✅ Phase 2: Dashboard (Empty State)

**What to Check:**
- ✅ Logo appears in header/sidebar
- ✅ "Dashboard" heading visible
- ✅ Stats cards show all zeros
- ✅ Empty state message: "No equipment yet"
- ✅ "Add Equipment" button visible
- ✅ "Generate Demo Data" button visible (if empty)

---

### ✅ Phase 3: Generate Demo Data (Recommended First Step)

**Option A: Use Demo Generator (Easiest)**
1. Click "Generate Demo Data" button on dashboard
2. OR navigate to: `http://localhost:3000/demo`
3. Click "Generate Demo Data"
4. Wait 5-10 seconds
5. **Expected:** 
   - Success message appears
   - Automatically redirects to dashboard
   - Dashboard shows 5 equipment items

**Option B: Manual Entry**
- Add equipment manually (see Phase 4)

---

### ✅ Phase 4: Equipment Management

**Add Equipment:**
1. Click "Add Equipment" button
2. Fill out form:
   - Name: "Ford F-150"
   - Type: "Truck"
   - Mileage: "120000"
   - Purchase Date: "2018-06-15"
   - Notes: "Main work truck"
3. Click "Add Equipment"
4. **Expected:**
   - Modal closes
   - Equipment appears in dashboard grid
   - Stats update (Total Equipment: 1)

**View Equipment Detail:**
1. Click on any equipment card
2. **Expected:**
   - Equipment detail page loads
   - Shows equipment info (name, type, mileage/hours)
   - "Log Maintenance" button visible
   - Maintenance Schedules section visible
   - Maintenance History section visible (empty)

**Test Equipment Types:**
- Add different types (Truck, Tractor, Excavator, etc.)
- **Expected:** Each shows relevant maintenance schedules

---

### ✅ Phase 5: Maintenance Logging

**Log Maintenance:**
1. Go to equipment detail page
2. Click "Log Maintenance" button
3. Fill out form:
   - Type: "Oil Change"
   - Date: Today (or recent date)
   - Cost: "75.00"
   - Mileage: "115000" (if equipment has mileage)
   - Notes: "Standard oil change"
4. Click "Log Maintenance"
5. **Expected:**
   - Modal closes
   - Maintenance appears in history (most recent first)
   - Equipment mileage/hours updated (if provided)

**Test Multiple Maintenance Types:**
- Log: Oil Change, Tire Rotation, Brake Service
- **Expected:** Each shows correct icon and color badge

**Test Delete Maintenance:**
1. Click delete icon (trash) on a maintenance record
2. Confirm deletion
3. **Expected:** Record removed from history

---

### ✅ Phase 6: Maintenance Schedules

**Enable Schedule:**
1. Go to equipment detail page
2. Scroll to "Maintenance Schedules" section
3. Check box next to "Oil Change"
4. Set interval: "3000" miles (or hours)
5. Click "Save Schedule"
6. **Expected:**
   - Schedule saved
   - Shows "Last done" (from maintenance history)
   - Shows "Next due" date (calculated)
   - Status badge appears (green/yellow/red)

**Test Usage Pattern Detection:**
1. Log 2-3 maintenance events with different mileage/hours
2. **Expected:**
   - Blue banner appears: "Smart Usage Detection Active"
   - Shows average miles/day or hours/week
   - Next due dates use actual usage patterns

**Test Schedule Status:**
- **Green:** Up to date (maintenance not due)
- **Yellow:** Due soon (within 14 days)
- **Red:** Overdue (past due date)

---

### ✅ Phase 7: Mobile Responsiveness

**Test Mobile View:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select mobile device (iPhone 12, etc.)

**What to Check:**
- ✅ Dashboard cards stack vertically
- ✅ Bottom navigation appears (not sidebar)
- ✅ Modals are mobile-friendly
- ✅ Text is readable without zooming
- ✅ Floating action button appears (bottom-right)

---

### ✅ Phase 8: Navigation

**Test All Navigation Links:**
- ✅ Dashboard → Shows equipment list
- ✅ Equipment → Shows equipment page
- ✅ Maintenance → Shows maintenance page
- ✅ Analytics → Shows analytics page
- ✅ Logo → Links to dashboard

**Test Active States:**
- ✅ Current page highlighted in navigation
- ✅ Mobile bottom nav shows active state

---

### ✅ Phase 9: Visual Design

**Check Logo:**
- ✅ Logo appears in header/sidebar
- ✅ Logo appears on login/signup pages
- ✅ Logo is clickable (links to dashboard)

**Check Button Colors:**
- ✅ All buttons are black/dark gray (not blue)
- ✅ Hover states work (darker gray)
- ✅ Focus states show black ring

**Check Color Scheme:**
- ✅ Consistent black/gray theme
- ✅ Status badges use correct colors (green/yellow/red)
- ✅ Maintenance type badges have colors

---

### ✅ Phase 10: Error Handling

**Test Form Validation:**
- Try submitting empty forms → Shows errors
- Try invalid dates (future) → Shows error
- Try negative numbers → Shows error

**Test Network Errors:**
- Disconnect internet
- Try to add equipment → Shows error message

**Test Not Found:**
- Navigate to invalid equipment ID → Shows "Equipment not found"

---

## 🎯 Key Features to Test

### Equipment Dashboard
- [ ] Equipment cards display correctly
- [ ] Status badges show (green/yellow/red)
- [ ] Stats update correctly
- [ ] Empty state works
- [ ] Add equipment modal works

### Maintenance Logging
- [ ] Log maintenance form works
- [ ] Maintenance history displays
- [ ] Equipment values update automatically
- [ ] Delete maintenance works
- [ ] Maintenance types show correct icons/colors

### Maintenance Schedules
- [ ] Schedules show for correct equipment types
- [ ] Enable/disable schedules works
- [ ] Save schedules works
- [ ] "Last done" auto-updates from history
- [ ] "Next due" calculates correctly
- [ ] Usage pattern detection works
- [ ] Status indicators accurate

### Navigation & UI
- [ ] Logo appears everywhere
- [ ] All buttons are black (not blue)
- [ ] Mobile layout works
- [ ] Navigation highlights active page
- [ ] Modals work correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution:** Check `.env` file has correct values

### Issue: "Row Level Security policy violation"
**Solution:** Make sure you ran database migration in Supabase

### Issue: Equipment not appearing
**Solution:** 
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies

### Issue: Maintenance not logging
**Solution:**
- Check `maintenance_type` column exists (not `type`)
- Verify form validation passes
- Check browser console for errors

### Issue: Schedules not showing
**Solution:**
- Check equipment type matches schedule categories
- Verify schedules were saved
- Refresh page

---

## 📊 What Success Looks Like

After generating demo data, you should see:

1. **Dashboard:**
   - 5 equipment cards
   - Stats: Total: 5, Good: X, Due Soon: Y, Overdue: Z

2. **Equipment Detail:**
   - Equipment information displayed
   - Maintenance schedules (some enabled)
   - Maintenance history (multiple records)
   - Usage pattern detection banner

3. **Functionality:**
   - Can add new equipment
   - Can log maintenance
   - Can enable/disable schedules
   - Can delete maintenance records
   - Status indicators update correctly

---

## 🚀 Quick Test Flow (5 Minutes)

1. **Start server:** `npm run dev`
2. **Open:** http://localhost:3000
3. **Sign up:** Create account
4. **Generate demo:** Click "Generate Demo Data"
5. **Explore:** Click equipment → See maintenance → Test schedules
6. **Test mobile:** Toggle device toolbar → Check layout

---

## 📝 Testing Notes

- All data is stored in your Supabase database
- You can delete equipment/maintenance if needed
- Demo data can be regenerated anytime
- Changes persist across page refreshes

---

## 🎉 You're Ready!

The app is fully functional. Test all features and enjoy seeing Fleet Unite in action!


