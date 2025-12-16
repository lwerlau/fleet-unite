# Fleet Unite - Predictive Maintenance Platform

A predictive maintenance platform for small equipment operators (1-10 machines). Built to help prevent expensive breakdowns through smart tracking and predictive alerts.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your URL and anon key
   - Copy `.env.example` to `.env` and fill in your Supabase credentials:
     ```bash
     cp .env.example .env
     ```

3. **Run database migrations:**
   - In Supabase dashboard, go to SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`
   - This creates all tables, RLS policies, and triggers

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Sign up for a new account
   - Start adding equipment!

## 📁 Project Structure

```
FleetUnite/
├── src/
│   ├── components/       # Reusable React components
│   ├── contexts/         # React Context providers (Auth)
│   ├── lib/             # Utilities and configs (Supabase)
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── supabase/
│   └── migrations/      # Database migration files
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🗄️ Database Schema

### Tables

- **users** - User profiles (extends Supabase auth)
- **equipment** - Equipment inventory
- **maintenance_events** - Historical maintenance records
- **maintenance_schedules** - Recurring maintenance schedules

All tables have Row Level Security (RLS) enabled - users can only access their own data.

## 🔐 Authentication

Uses Supabase Auth with email/password. Protected routes require authentication.

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Charts:** Recharts (for analytics)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **PWA:** Vite PWA plugin

## 📱 Features (MVP)

- ✅ User authentication (signup/login)
- ✅ Equipment dashboard
- ✅ Equipment CRUD (add/edit/delete)
- 🚧 Maintenance tracking (in progress)
- 🚧 Predictive alerts (in progress)
- 🚧 Analytics dashboard (in progress)

## 🚀 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Supabase (Backend)

Already hosted - no deployment needed. Just ensure RLS policies are set.

## 📝 Development Roadmap

### Week 1: Core Product
- [x] Project setup
- [x] Authentication
- [x] Equipment dashboard
- [ ] Equipment detail page
- [ ] Maintenance logging
- [ ] Maintenance schedules
- [ ] Predictive logic
- [ ] Analytics

### Week 2: Business & Launch
- [ ] Landing page
- [ ] Pricing page
- [ ] PWA optimization
- [ ] Demo data
- [ ] Documentation
- [ ] Domain setup

## 🤝 Contributing

This is a personal project for college admissions. Not accepting contributions at this time.

## 📄 License

Private project - All rights reserved

## 👤 Author

**Lucas Werlau**
- Computer Science Student (3.93 GPA)
- Former Farm Operations Manager (4+ years)
- Building Fleet Unite to solve a real problem

---

Built with ❤️ for small equipment operators

