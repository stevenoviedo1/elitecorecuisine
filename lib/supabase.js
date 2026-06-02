import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key.
// This client has full database access and should ONLY be used in API routes / server code.

const supabaseUrl = process.env.SUPABASE_URL;

// Support both old and new Supabase key naming (2026+)
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ||           // New recommended format (sb_secret_...)
  process.env.SUPABASE_SERVICE_ROLE_KEY;       // Legacy JWT service_role key

let supabase;

const isPlaceholder =
  !supabaseUrl ||
  !supabaseSecretKey ||
  supabaseUrl.includes('your-project-url') ||
  supabaseSecretKey.includes('REPLACE_WITH') ||
  supabaseSecretKey.includes('your_') ||
  supabaseSecretKey.length < 30;

if (isPlaceholder) {
  console.error(`
❌ Supabase is not properly configured!

Your project is likely using Supabase's new API key system (2025/2026).

HOW TO FIX:
1. Go to your Supabase Dashboard
2. Click **Settings** (left sidebar) → **API Keys**
   (direct link: https://supabase.com/dashboard/project/_/settings/api-keys)
3. Under "Secret keys", create a new key or copy an existing one (starts with sb_secret_...)
4. Paste the FULL key into .env.local as:
   SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxxxxxx

Legacy keys (if still available) are in the "Legacy anon, service_role API keys" tab.

Current values detected:
  SUPABASE_URL = ${supabaseUrl || '(not set)'}
  SECRET_KEY   = ${supabaseSecretKey ? '(set but too short or invalid)' : '(not set)'}

After updating .env.local, restart the dev server.
`);

  // Dummy client so the app doesn't completely crash
  supabase = createClient('https://placeholder.supabase.co', 'placeholder');
} else {
  supabase = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('✅ Supabase client initialized successfully (using secret key)');
}

export { supabase };

// Helper to convert database snake_case rows to camelCase for the frontend
export function mapOrderFromDB(dbOrder) {
  if (!dbOrder) return null;

  return {
    id: dbOrder.id,
    items: dbOrder.items,
    customer: dbOrder.customer,
    total: dbOrder.total,
    status: dbOrder.status,
    paymentStatus: dbOrder.payment_status || 'unpaid',
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    cancellationReason: dbOrder.cancellation_reason || null,
  };
}

// Helper to convert incoming data to snake_case for the database
export function mapOrderToDB(orderData) {
  const payload = {
    id: orderData.id,
    items: orderData.items,
    customer: orderData.customer,
    total: orderData.total,
    status: orderData.status,
    created_at: orderData.createdAt || new Date().toISOString(),
    updated_at: orderData.updatedAt || null,
    cancellation_reason: orderData.cancellationReason || null,
  };

  // Only include payment_status if explicitly provided (avoids column-not-found errors
  // until the column is added to the orders table via ALTER TABLE)
  if (orderData.paymentStatus !== undefined) {
    payload.payment_status = orderData.paymentStatus;
  }

  return payload;
}
