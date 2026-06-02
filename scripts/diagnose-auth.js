/**
 * Diagnostic script for Elite Core Cuisine auth issues
 * Run with: node scripts/diagnose-auth.js
 */

const fs = require('fs');
const path = require('path');

// Manually load .env.local (no extra deps needed)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eq = trimmed.indexOf('=');
        if (eq > 0) {
          const key = trimmed.slice(0, eq).trim();
          let val = trimmed.slice(eq + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const { supabase } = require('../lib/supabase');

console.log('=== AUTH DIAGNOSTIC ===\n');

console.log('1. Checking Supabase client initialization (from lib/supabase.js)...');
console.log('   (Any big red error above this means your SUPABASE_SECRET_KEY is invalid or incomplete.)\n');

async function diagnose() {
  console.log('2. Testing Supabase connection and staff_users table...');

  try {
    // Check if table exists (count without filtering)
    const { count, error: tableErr } = await supabase
      .from('staff_users')
      .select('*', { count: 'exact', head: true });

    if (tableErr) {
      console.log('   ❌ Cannot access staff_users table:', tableErr.message);
      console.log('\n   → Run the SQL in supabase/schema.sql inside Supabase SQL Editor first.');
      return;
    }

    console.log(`   ✅ staff_users table exists (current rows: ${count})`);

    // Check for owner specifically (use maybeSingle to avoid coerce error)
    const { data, error } = await supabase
      .from('staff_users')
      .select('id, email, role, created_at')
      .eq('email', 'owner@elitecorecuisine.com')
      .maybeSingle();

    if (error) {
      console.log('   ❌ Query error for owner:', error.message);
    } else if (data) {
      console.log('   ✅ Owner account found in DB:');
      console.log('      ', data);
    } else {
      console.log('   ⚠️  No owner row found for owner@elitecorecuisine.com');
      console.log('      → Run: npm run seed:staff   (or paste INSERT SQL)');
    }
  } catch (err) {
    console.log('   ❌ Unexpected error:', err.message);
  }

  console.log('\n3. Environment fallback check:');
  console.log('   OWNER_PASSWORD present?', !!process.env.OWNER_PASSWORD);
  console.log('   WORKER_PASSWORD present?', !!process.env.WORKER_PASSWORD);

  console.log('\n=== END OF DIAGNOSTIC ===');
  console.log('\nIf the client says ✅ but you still see "Supabase not configured" in the app:');
  console.log('- Make sure you restarted `npm run dev` after editing .env.local');
}

diagnose();
