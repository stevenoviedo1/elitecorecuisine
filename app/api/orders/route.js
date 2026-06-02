import { NextResponse } from 'next/server';
import { supabase, mapOrderFromDB, mapOrderToDB } from '../../../lib/supabase';

// ============================================
// Supabase-powered Orders API
// Replaces the old file-based JSON system
// ============================================

// GET /api/orders - Fetch all orders (newest first)
export async function GET() {
  try {
    // Graceful handling when Supabase is not properly configured
    if (!supabase || supabase.supabaseUrl?.includes('placeholder')) {
      console.warn('Supabase not configured - returning empty orders list');
      return NextResponse.json({
        orders: [],
        warning: 'Supabase is not configured. Orders will not be saved or loaded.'
      });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ 
        orders: [],
        error: 'Failed to fetch orders from database' 
      }, { status: 500 });
    }

    // Map snake_case DB rows → camelCase for frontend
    const orders = (data || []).map(mapOrderFromDB);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders from Supabase:', error);
    return NextResponse.json({ 
      orders: [],
      error: 'Failed to load orders' 
    }, { status: 500 });
  }
}

// POST /api/orders - Create a new order from the website (PUBLIC - customer self-serve)
// 
// POS / EXISTING SYSTEM INTEGRATION STRATEGY (Hybrid model recommended):
// This endpoint is the single source of truth for *website-originated* orders.
// 1. We always save to our Supabase `orders` table (flexible JSONB).
// 2. After successful save we run "side effects" (kitchen notification, future POS push).
//    Side effects MUST be non-blocking (try/catch + continue on failure) so the
//    customer always gets a successful order + order number even if the external
//    POS or printer is temporarily down.
// 3. The excellent thermal printTicket() lives in the staff dashboard (app/orders/page.jsx).
//    For true "fire and forget" kitchen printing you can later trigger a server-side
//    print (PrintNode, ESC/POS over network, etc.) from here.
//
// When the owner tells you their exact POS (Square, Toast, Clover, etc.):
// - Create a thin adapter in lib/pos-integrations/<provider>.js
// - Call it from the "Integration side-effects" block below.
// - Add the required env vars (never commit secrets).
// - Add a small "Synced to POS" badge in the dashboard order card.
//
// Current default (Phase 1 hybrid): Website takes the order, dashboard + thermal tickets
// handle the kitchen, owner keeps using their existing POS for counter payments / inventory.
// Double-entry is minimal and acceptable for most small restaurants while we prove value.

export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation (same as before)
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!body.customer || !body.customer.name || !body.customer.phone) {
      return NextResponse.json(
        { error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }

    const newOrder = {
      id: `ELITE-${Date.now().toString().slice(-8)}`,
      ...body,
      status: 'pending',
      paymentStatus: 'unpaid',   // default for new orders
      createdAt: new Date().toISOString(),
      updatedAt: null,
      cancellationReason: null,
    };

    // Convert to snake_case for DB
    const dbOrder = mapOrderToDB(newOrder);

    const { error } = await supabase
      .from('orders')
      .insert(dbOrder);

    if (error) {
      console.error('Supabase INSERT error:', error);
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      );
    }

    // ============================================
    // INTEGRATION SIDE-EFFECTS (non-blocking)
    // ============================================
    // This is where we will later plug in:
    // - Kitchen notification (email/SMS to kitchen line, or server-side thermal print)
    // - POS push (Square Orders API, Toast, Clover, etc.)
    // - Any other webhooks or logging
    //
    // Always wrap in its own try/catch so a failing integration never breaks
    // the customer experience.
    try {
      // Example future hook (no-op today):
      // await notifyKitchen(newOrder);
      // await pushToPOS(newOrder);   // <-- implement per provider after owner names the system

      // For now we just log so you can see orders hitting this path in the dev server.
      console.log(`[Order] New website order ${newOrder.id} saved. Ready for kitchen notification / POS integration hooks.`);
    } catch (integrationErr) {
      // Never fail the customer order because of a side effect
      console.error('[Order] Non-blocking integration side-effect failed (order still succeeded):', integrationErr);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order placed successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order in Supabase:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders - Update status or add cancellation reason (used by dashboard)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, ...otherUpdates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Build the update payload
    const updatePayload = {
      ...otherUpdates,
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
    }

    // Support paymentStatus updates from staff dashboard
    if (otherUpdates.paymentStatus) {
      updatePayload.payment_status = otherUpdates.paymentStatus;
      delete updatePayload.paymentStatus;
    }

    // Handle cancellation reason specifically
    if (otherUpdates.cancellationReason !== undefined) {
      updatePayload.cancellation_reason = otherUpdates.cancellationReason;
      delete updatePayload.cancellationReason; // avoid duplicate key
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase PATCH error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    // Return camelCase version to frontend
    const updatedOrder = mapOrderFromDB(data);

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    console.error('Error updating order in Supabase:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
