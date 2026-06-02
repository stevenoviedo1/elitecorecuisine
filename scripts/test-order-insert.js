/**
 * Quick diagnostic: Try to insert a test order to see the exact Supabase error.
 * Run: node scripts/test-order-insert.js
 */

const fs = require('fs');
const path = require('path');

// Load .env.local
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
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
          if (!process.env[key]) process.env[key] = val;
        }
      }
    });
  }
}
loadEnv();

const { supabase, mapOrderToDB } = require('../lib/supabase');

async function testInsert() {
  console.log('Testing order insert into Supabase...\n');

  const testOrder = {
    id: `TEST-${Date.now()}`,
    items: [{ name: "Test Taco", price: 5.99, quantity: 1 }],
    customer: { name: "Test User", phone: "555-1234", orderType: "takeout", paymentPreference: "in-person" },
    total: 5.99,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const dbOrder = mapOrderToDB(testOrder);

  console.log('Attempting insert with payload:');
  console.log(JSON.stringify(dbOrder, null, 2));

  const { data, error } = await supabase
    .from('orders')
    .insert(dbOrder)
    .select()
    .single();

  if (error) {
    console.error('\n❌ INSERT FAILED:');
    console.error('Error code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
    console.error('\nFull error object:', error);

    if (error.code === '42P01') {
      console.log('\n→ The orders table does not exist. Run the SQL from supabase/schema.sql');
    }
    if (error.code === '42501' || error.message.includes('permission')) {
      console.log('\n→ Permission denied (likely RLS). The service key should bypass RLS, but check policies.');
    }
  } else {
    console.log('\n✅ Test order inserted successfully!');
    console.log('Returned row:', data);
  }
}

testInsert().catch(console.error);