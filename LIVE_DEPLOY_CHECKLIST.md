# Live Deploy Checklist + Copy-Paste Text (for Elite Core Cuisine)

Use this when you're ready to buy the domain and make the site "somewhat live".

## 1. Worker Login Info (share securely with kitchen staff only)

After running `npm run seed:staff` against your production Supabase:

**Worker (kitchen staff):**
- Go to: https://YOUR-DOMAIN.com/login
- Email: worker@elitecorecuisine.com
- Password: Worker78577   ← Change this for production if desired (see scripts/README.md)

**Owner (you):**
- Email: owner@elitecorecuisine.com
- Password: Pharr78577   ← **CHANGE THIS IMMEDIATELY** after first login using the dashboard "Change Password" section.

**Security reminder:**
- Share only with trusted people.
- Rotate owner password on the live site right after seeding.
- Public customers do **not** log in. They order from the homepage.

## 2. Quick Vercel + Domain Steps (high level)

1. Push code to GitHub.
2. Deploy on Vercel (import repo).
3. Add all env vars from .env.example in Vercel (Production). Generate strong NEXTAUTH_SECRET.
4. Buy domain (Namecheap recommended or Vercel Domains) — search elitecorecuisine.com etc.
5. In Vercel project → Settings → Domains → Add your domain.
6. Set the DNS records Vercel shows you (A + CNAME, or nameservers).
7. Wait for propagation + HTTPS.
8. Seed staff with prod Supabase keys (`npm run seed:staff`).
9. Log in as owner on the custom domain and rotate password.
10. Test full flow as customer + as worker.

See the main README.md for the detailed step-by-step guide (including exact 2026 DNS examples).

## 3. Copy-Paste for Owner / Team

**To the restaurant owner:**

"We're ready to make the site live with a real domain.

Customers will be able to order online/takeout (or dine-in) directly from the beautiful site using your real menu and photos. Their orders will show up instantly in the staff dashboard at /orders, where the team can print professional kitchen tickets and manage status.

We'll keep using your existing POS for payments at the counter (hybrid approach — this is the safest and most common way to start).

Next steps for you:
- Approve / buy the domain (suggestions: elitecorecuisine.com or similar).
- I'll deploy it to Vercel (free) and connect the domain.
- We'll seed the staff logins and test real orders.
- Your kitchen gets better tickets and visibility with almost no change to daily routine.

This lets us prove the value with real customer orders right away."

**To kitchen staff (after live):**

"New system is live!

To see incoming online orders and print kitchen tickets:
1. Go to [your new domain]/login on a phone or tablet in the kitchen.
2. Log in as:
   - worker@elitecorecuisine.com
   - Password: [the one we set]
3. You'll see all orders. Use the buttons to move them through pending → preparing → ready.
4. Click 'Print Ticket' on any order — it opens a clean receipt formatted for our thermal printer.

Pay in person as usual. Let me know if you have questions!"

## 4. Production Env Vars Reminder (Vercel)

Must set (at minimum):
- SUPABASE_URL
- SUPABASE_SECRET_KEY (full prod secret)
- NEXTAUTH_SECRET (strong 32+ char random)
- RESEND_API_KEY (optional)
- OWNER_EMAIL / WORKER_EMAIL (for seeding)

## 5. Post-Live Monitoring

- Watch the /orders dashboard for the first real orders.
- Be ready to adjust prep times or notes in the success message if needed.
- Check Supabase usage.
- After a week or two of real data, we can discuss deeper POS integration (if desired) or other polish.

Run `npm run build` locally before any big push to live.

Good luck — this is the exciting part!