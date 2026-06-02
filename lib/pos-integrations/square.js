/**
 * Square POS Adapter (stub / example)
 *
 * Only implement and enable this after the owner:
 *   - Confirms they use Square for Restaurants
 *   - Gives you a valid Square Access Token + Location ID (sandbox first!)
 *   - Agrees to a pilot
 *
 * Usage (once wired in api/orders/route.js):
 *   import { createOrder as createSquareOrder } from '../lib/pos-integrations/square';
 *   await createSquareOrder(websiteOrder);
 *
 * Our order shape (from CheckoutModal + Cart):
 * {
 *   id: 'ELITE-...',
 *   items: [{ name, price, quantity, options? }],
 *   customer: { name, phone, orderType, tableNumber?, paymentPreference, notes?, email? },
 *   total,
 *   status, paymentStatus, createdAt, ...
 * }
 *
 * Square expects line items that usually reference their catalog or use ad-hoc names.
 * For a first version, many people just use the display name + note.
 * Test carefully — bad item matching is the #1 source of problems.
 */

export async function createOrder(websiteOrder) {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken || !locationId) {
    console.warn('[Square] POS integration not configured (missing env vars). Skipping.');
    return { skipped: true, reason: 'no-credentials' };
  }

  // TODO: Real implementation
  // 1. Map items to Square line_items (name, quantity, base_price_money, etc.)
  // 2. Build customer info if desired
  // 3. Call Square Orders API: POST /v2/orders with location_id
  //    https://developer.squareup.com/reference/square/orders-api/create-order
  //
  // Example skeleton (you would need node-fetch or the official squareup SDK):
  //
  // const lineItems = websiteOrder.items.map(item => ({
  //   name: item.name,
  //   quantity: String(item.quantity),
  //   base_price_money: {
  //     amount: Math.round(item.price * 100),
  //     currency: 'USD'
  //   }
  // }));
  //
  // const res = await fetch('https://connect.squareup.com/v2/orders', {
  //   method: 'POST',
  //   headers: {
  //     'Square-Version': '2025-01-01',
  //     Authorization: `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     order: {
  //       location_id: locationId,
  //       line_items: lineItems,
  //       // reference_id: websiteOrder.id,  // very useful for reconciliation
  //       // note: websiteOrder.customer.notes,
  //     }
  //   })
  // });
  //
  // if (!res.ok) throw new Error(`Square createOrder failed: ${await res.text()}`);
  // const data = await res.json();
  // return { success: true, squareOrderId: data.order?.id };

  // Placeholder so the hook can be called safely today
  console.log(`[Square stub] Would push order ${websiteOrder.id} to Square (location ${locationId}). Implement createOrder() when ready.`);
  return { success: true, stub: true, squareOrderId: null };
}

// Future helpers you may want:
// - updateOrderStatus(squareId, newStatus)
// - getPaymentStatus etc.
// - Menu sync (pull catalog items on a schedule)

export default { createOrder };