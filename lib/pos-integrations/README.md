# POS Integrations (Future / Optional Phase)

This folder holds thin adapters so the website can push orders into the owner's existing Point of Sale system.

## Current Recommended Model (Hybrid)
- The website (public site + this checkout) is the **customer self-serve + online/takeout channel**.
- Orders are saved to Supabase and appear in the excellent `/orders` staff dashboard.
- The built-in `printTicket()` (see `app/orders/page.jsx`) produces clean 80mm thermal kitchen tickets — often better than what generic POS online modules provide.
- For now, staff can quickly ring the same order in the existing POS for payments, taxes, and inventory (if the old POS tracks that).
- This is low-friction and very common for small independent restaurants.

Only move to automated push **after**:
1. The owner names the exact POS.
2. You run a 2–6 week pilot so you know real order volume.
3. The owner gives you API keys / partner access.

## How to Add a New Adapter (example: Square)

1. Create `lib/pos-integrations/square.js` (or toast.js, clover.js, etc.).
2. Export an async function `createOrder(websiteOrder)` that maps our shape to the POS and calls their API.
3. In `app/api/orders/route.js`, in the "INTEGRATION SIDE-EFFECTS" block (inside the try), call:
   ```js
   // await pushToPOS(newOrder);
   ```
4. Add the required secrets to `.env.local` (and `.env.example` as comments):
   ```
   # Square (optional POS integration)
   SQUARE_ACCESS_TOKEN=...
   SQUARE_LOCATION_ID=...
   ```
5. Handle mapping carefully:
   - Our items are simple: `{name, price, quantity, options?}`
   - Most POS want catalog object IDs or line items with their own SKUs.
   - Start with name-only matching + note "verify menu items match exactly between website and POS".
6. Always make the call non-blocking and log failures.

## Square (most common for small spots) – High-level notes
- Use the Square Orders API + Square Payments (for future paid orders).
- You can create an order with `state: "OPEN"` or fire it directly.
- Test orders usually need to be paid (cash or external) to appear on devices in some flows.
- Good docs: https://developer.squareup.com/reference/square/orders-api/create-order

## Toast notes
- Strong for full-service restaurants.
- API access and webhooks are powerful but often require being in their partner program or specific subscription.
- Webhooks can notify *us* when things happen in Toast (less common direction for intake).

## Clover
- Has a public app marketplace and REST APIs.
- Relatively straightforward for small teams.

## Generic / No-code bridges (quick win)
- Many restaurants use Make.com, Zapier, or services like vGrubs / Ressto that already have pre-built connectors to Square, Toast, Clover, Lightspeed, etc.
- You can POST a simple payload from our route to a Make webhook — often faster than writing full SDK code.

## Menu Sync (future, harder)
- Our menu lives in `data/menu.js` (and is rendered from there).
- Real source of truth for many owners is the POS menu.
- Later you can add:
  - A simple admin UI to edit the menu.
  - Scheduled import (CSV export from POS → our format).
  - Or direct API pull on the POS side.

## Current Behavior (safe default)
Until an adapter is wired, every website order still:
- Saves reliably to Supabase
- Shows up instantly in the staff dashboard
- Can be printed with the excellent thermal ticket
- Is visible with the "WEBSITE" pill

This alone is already a big upgrade for most owners (better customer experience + clearer kitchen tickets).

## Questions to Ask the Owner First
See the main project README or the implementation response for the exact list (what POS, current pains, inventory needs, willingness for pilot, API access, etc.).

Do not promise "it will talk to your POS day one" until you know the system and have tested the pilot.

---
Add adapters here only when the owner is ready and has given you the specifics. The hybrid approach (website for customers + dashboard + tickets + keep existing POS for payments) is usually the smartest first step.