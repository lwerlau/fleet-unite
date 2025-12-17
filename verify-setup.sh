#!/bin/bash

echo "🔍 Fleet Unite - Setup Verification"
echo "===================================="
echo ""

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js not found. Install from nodejs.org or use: brew install node"
fi

# Check npm
echo ""
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
else
    echo "   ❌ npm not found"
fi

# Check .env file
echo ""
echo "3. Checking environment variables..."
if [ -f .env ]; then
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "   ✅ .env file exists with Supabase variables"
        # Check if they're not placeholder values
        if grep -q "your.*here" .env; then
            echo "   ⚠️  Warning: .env may contain placeholder values. Make sure to replace them!"
        fi
    else
        echo "   ⚠️  .env exists but missing required variables"
    fi
else
    echo "   ❌ .env file not found"
fi

# Check node_modules
echo ""
echo "4. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   ❌ Dependencies not installed. Run: npm install"
fi

# Check Supabase migration
echo ""
echo "5. Database migration status..."
echo "   ⚠️  Manual check required:"
echo "   - Go to Supabase Dashboard → SQL Editor"
echo "   - Verify migration 001_initial_schema.sql has been run"
echo "   - Check Table Editor for: users, equipment, maintenance_events, maintenance_schedules"

echo ""
echo "===================================="
echo "Next steps:"
echo "1. Install Node.js if missing"
echo "2. Run: npm install"
echo "3. Verify Supabase migration is run"
echo "4. Run: npm run dev"
echo ""


