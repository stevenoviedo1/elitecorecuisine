# Elite Core Cuisine- Restaurant Website

Welcome to **EliteCoreCuisine**, your go-to place for delicious food that satisfies your cravings, anytime, anywhere. This is a fully responsive restaurant website that allows users to browse the menu, read customer reviews, explore various dishes, and place orders online.

---

## Project Overview

Elite Core Cuisine is a restaurant website designed to provide an exceptional online dining experience. It showcases the restaurant’s best dishes, offers an easy-to-navigate menu, features customer reviews, and allows users to place their orders directly through an intuitive order form. The site is visually appealing and interactive, with hover effects, a swiper for customer reviews, and an interactive search bar.

---

## Features

- Responsive Design: Optimized for mobile and desktop devices.
- Home Section: Featuring delicious food images and engaging copy to captivate visitors.
- Menu: Browse the restaurant's offerings with an option to add items to the cart.
- Dish Categories: View different categories of dishes and order your favorite meal.
- Order Section: Easy-to-fill form for ordering food, including options to customize orders.
- Customer Reviews: View testimonials from satisfied customers.
- Search Box: Users can search for menu items with an interactive search bar.

---

## Technologies

- Next.js
- Tailwind CSS
- React
- Font Awesome

---

## Staff Dashboard & Supabase Setup (Important for 2026+)

The internal order management system (`/orders`) requires a Supabase **Secret key** for admin access.

### How to get the correct key

1. Go to your Supabase project
2. In the left sidebar click **Settings** → **API Keys**  
   (or visit: `https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api-keys`)
3. Look for **Secret keys** (they start with `sb_secret_...`)
4. Create a new one if needed, then copy the **full** key
5. Paste it into `.env.local` as:

```env
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxxxxxx   # ← full key here
```

Legacy JWT keys (if still shown) can be used under the old variable name, but Secret keys are preferred.

After changing the key, **restart** the dev server.

The old long `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` service_role keys are being phased out.

---

## POS Integration (Existing Point-of-Sale System)

The owner likely already uses a POS (Square, Toast, Clover, Lightspeed, basic register, etc.).

**This website does NOT have to replace the POS.**

### Recommended Approach (Hybrid – Safest & Most Common)
- Use the beautiful public site for customer self-serve ordering (online, takeout, optional dine-in). This reduces phone calls.
- Orders land in Supabase and appear instantly in the powerful `/orders` staff dashboard.
- Use the built-in thermal kitchen ticket printing (`Print Ticket` button on any order) — often cleaner and more reliable than generic POS tickets.
- Staff can quickly ring the order in the existing POS for payment, taxes, or inventory if that system is the current source of truth.
- Result: Modern customer experience + better kitchen visibility, with almost zero change to the owner's daily POS habits.

Many small restaurants run exactly this model successfully.

### When to Add Deeper Integration
Only after:
1. You ask the owner exactly which POS they use and what their current pains are.
2. You run a 30–60 day pilot with real orders using the hybrid model above.
3. The owner is comfortable giving API access.

See `lib/pos-integrations/README.md` and the example stub in `lib/pos-integrations/square.js` for how to wire automated "push order to POS" later.

### Critical Questions to Ask the Owner
1. What POS system are you using right now?
2. Walk me through a typical order today (phone/walk-in → kitchen ticket → payment).
3. Biggest pains with the current process?
4. Do you rely on the POS heavily for inventory and reporting, or mostly for taking card payments?
5. Willing to do a short pilot where online orders come through the new site + dashboard + tickets while you keep the old POS for counter payments?
6. Can you get developer/API access to the current POS?

### Technical Note
The middleware now allows public customers to place orders (POST /api/orders) without logging in, while the staff dashboard and management actions stay protected.

The POST handler in `app/api/orders/route.js` is already structured with a clear "Integration side-effects" block for future POS adapters.

---

## Quick Start (Development)

1. `cp .env.example .env.local` and fill real Supabase secret key + other values.
2. Run the seed for staff users: `npm run seed:staff`
3. `npm run dev`
4. Visit http://localhost:3000 (public site) and http://localhost:3000/orders (after logging in as owner@... / the seeded password).

See the plan file in the session for the full POS strategy and implementation phases.

---

## Staff Logins (Worker & Owner)

**Worker login (for kitchen staff):**
- Email: `worker@elitecorecuisine.com`
- Password: `Worker78577` (default)

**Owner login (for you/manager — full controls + stats):**
- Email: `owner@elitecorecuisine.com`
- Password: `Pharr78577` (default)

**How to set / reset them:**
- Run `npm run seed:staff` (this upserts secure bcrypt hashes into your Supabase `staff_users` table).
- See `scripts/README.md` for full details and how to customize the worker password via `WORKER_PASSWORD` in `.env.local`.

**Important for production / "live" use:**
- Change the owner password immediately after first login (use the "Change Password (optional)" section inside the `/orders` dashboard).
- Share the worker credentials securely with kitchen staff only (password manager or in person). Do not post them publicly.
- These are **staff-only** logins at `/login`. Regular customers never need to log in — they order directly from the homepage (cart → checkout).

The auth system prefers the Supabase table (supports password changes) and has safe fallbacks.

---

## Making It "Somewhat Live" (Domain + Deployment)

You are ready to buy a domain and put this in front of real customers + your team. The site is in good shape for a **hybrid live deployment**:

- Public customers can browse the real menu, add items, and place takeout/dine-in orders (no delivery).
- Orders appear in your protected `/orders` dashboard.
- Your team can manage status and print excellent thermal kitchen tickets.
- You continue using your existing POS for payments/counter (recommended hybrid approach — see POS section above).

This is "somewhat live" / production prototype: real orders work, but online payments are still "in person only", and it's tied to your current ops flow.

### Recommended Path: Vercel + Any Domain Registrar (2026)

**1. Prepare**
- Make sure your code is in GitHub (or Git provider Vercel supports).
- Generate a strong secret: `openssl rand -base64 32` (for NEXTAUTH_SECRET).
- Test locally with real Supabase keys.

**2. Deploy to Vercel (easiest for Next.js)**
- Go to https://vercel.com and sign in with GitHub.
- Import your repository as a new project.
- In the project (or after first deploy): Settings → Environment Variables. Add all the keys from `.env.example` for **Production** (and Preview if desired):
  - `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (your real production Supabase values)
  - `NEXTAUTH_SECRET` (the strong random one you generated — required)
  - `RESEND_API_KEY` (if you want receipt emails)
  - `OWNER_EMAIL`, `WORKER_EMAIL`, etc. (the seed script uses these)
- Deploy. You'll get a free `*.vercel.app` URL immediately. Test the public site + staff login there.

**3. Buy your domain**
- Search/buy at Namecheap, Google Domains, GoDaddy, or directly in Vercel (https://vercel.com/domains).
- Good options: `elitecorecuisine.com`, `elitecorecuisinepharr.com`, or add `www.`.
- Price is usually ~$10–20 for the first year.

**4. Connect the custom domain in Vercel**
- In your Vercel project: Settings → Domains.
- Add your domain (e.g. `elitecorecuisine.com` and `www.elitecorecuisine.com`).
- Vercel will show the exact DNS records you need to set at your registrar:
  - Typical (apex + www):
    - A record for `@` (or the root) → `76.76.21.21`
    - CNAME for `www` → `cname.vercel-dns.com` (or the exact value shown)
  - Or (often simpler): Change the nameservers at your registrar to Vercel's (`ns1.vercel-dns.com` and `ns2.vercel-dns.com`). Vercel then fully manages DNS + SSL.
- Save the records. Propagation usually takes a few minutes to a couple of hours.
- Vercel automatically provisions HTTPS (SSL) for free.

**5. Production Supabase + Seed staff accounts**
- Use (or create) a production Supabase project.
- Make sure the `orders` and `staff_users` tables exist (run the SQL from `supabase/schema.sql`).
- Temporarily set your local `.env.local` (or use a one-off command) to your **production** Supabase keys.
- Run `npm run seed:staff` to create the owner + worker accounts in the live database.
- **Immediately** log in as owner on the live site and change the `Pharr78577` password using the dashboard UI.
- Remove any plaintext passwords from local env after seeding.

**6. Test the live site thoroughly**
- As a customer (no login): Go to your custom domain → add items from the real menu → checkout (takeout or dine-in with optional table) → see the success screen with order number.
- As staff: Log in at `yourdomain.com/login` as the worker (or owner) → see the order in `/orders` → try status changes and the "Print Ticket" button (it opens a clean 80mm thermal receipt ready for your kitchen printer).
- Test on phone (very important for a restaurant).
- Verify the floating cart button, search, hearts, etc. all work.

**7. Go live with your team**
- Share the worker login securely with kitchen staff.
- Update Google Business Profile, any physical menus/signs, socials, etc. with the new ordering link.
- Optional but recommended: Add a small note on the site footer like "Online orders • Pay at counter or table as usual."

### Production Checklist (do these before or right after going live)
- Strong, unique `NEXTAUTH_SECRET` set in Vercel (never the placeholder).
- All Supabase keys are the real production secret keys (sb_secret_...).
- Owner password rotated.
- Worker password is not the default if this is real staff use.
- Test a full public order end-to-end on the custom domain.
- Monitor Supabase usage (free tier has limits on rows/bandwidth).
- The site is ready for real orders thanks to the public checkout path (middleware allows unauthenticated POST /api/orders while keeping the staff dashboard protected).
- Have a way to monitor first real orders (the dashboard auto-refreshes).

### Costs
- Domain: ~$10–20/year.
- Vercel: Free for this level of traffic (hobby plan is generous).
- Supabase: Free tier is usually fine to start; upgrade if you get heavy usage.
- Resend (emails): Free tier for low volume.

Once live, real customer orders will start flowing into your dashboard + kitchen tickets. This is a powerful proof point for the owner.

See `scripts/README.md` for the latest on seeding and worker logins.

If you run into any issues (DNS, env vars, seeding against prod Supabase), share the exact error and we can debug quickly.

---

*End of deployment section*

