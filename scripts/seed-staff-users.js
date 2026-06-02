/**
 * Seed Staff Users into Supabase
 * 
 * Usage:
 *   npm run seed:staff
 * 
 * This script:
 * - Creates/updates the Owner with password "Pharr78577"
 * - Creates/updates the Worker using WORKER_PASSWORD from .env (or fallback)
 * 
 * Run this after creating the staff_users table.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Simple .env.local loader (no dotenv dep)
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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedStaffUsers() {
  console.log('🌱 Seeding staff users into Supabase...\n');

  // === OWNER ===
  const ownerEmail = process.env.OWNER_EMAIL || 'owner@elitecorecuisine.com';
  const ownerPassword = 'Pharr78577'; // As requested
  const ownerName = 'Owner';

  const ownerHash = await bcrypt.hash(ownerPassword, 10);

  const { error: ownerError } = await supabase
    .from('staff_users')
    .upsert({
      id: 'owner',
      email: ownerEmail.toLowerCase(),
      password_hash: ownerHash,
      role: 'owner',
      name: ownerName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

  if (ownerError) {
    console.error('❌ Failed to seed Owner:', ownerError.message);
  } else {
    console.log(`✅ Owner seeded: ${ownerEmail}`);
    console.log(`   Password: ${ownerPassword}  (change this after first login!)\n`);
  }

  // === WORKER ===
  const workerEmail = process.env.WORKER_EMAIL || 'worker@elitecorecuisine.com';
  let workerPassword = process.env.WORKER_PASSWORD;

  // Avoid using placeholder passwords
  if (!workerPassword || workerPassword.includes('CHANGE') || workerPassword.includes('placeholder')) {
    workerPassword = 'Worker78577'; // Safe default
    console.log('⚠️  Using default worker password: Worker78577');
  }

  const workerHash = await bcrypt.hash(workerPassword, 10);
  const workerName = 'Worker';

  const { error: workerError } = await supabase
    .from('staff_users')
    .upsert({
      id: 'worker',
      email: workerEmail.toLowerCase(),
      password_hash: workerHash,
      role: 'worker',
      name: workerName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

  if (workerError) {
    console.error('❌ Failed to seed Worker:', workerError.message);
  } else {
    console.log(`✅ Worker seeded: ${workerEmail}`);
    console.log(`   Password: ${workerPassword}\n`);
  }

  console.log('🎉 Seeding complete!');
  console.log('\nNext steps:');
  console.log('1. Restart your dev server');
  console.log('2. Log in as owner using the new password');
  console.log('3. Go to /orders → Use the "Change Password" card to update it\n');
}

seedStaffUsers().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
