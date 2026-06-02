# Staff User Seeding

This folder contains scripts for managing staff authentication accounts.

## Initial Setup (Required)

1. Run the SQL from `supabase/schema.sql` in your Supabase SQL Editor (creates the `staff_users` table).

2. Seed the initial accounts:

   **Fastest way (recommended):**
   ```powershell
   npm run seed:staff
   ```

   This will set:
   - **Owner** (you / manager — full revenue stats, controls, password change):
     - `owner@elitecorecuisine.com` / `Pharr78577`
   - **Worker** (kitchen staff — status updates, print tickets, limited cancel):
     - `worker@elitecorecuisine.com` / `Worker78577`

   **Worker login info (answer to your question):**  
   After seeding, workers log in at `/login` using:
   - Email: `worker@elitecorecuisine.com`
   - Password: `Worker78577`  
   (This is the default. Change it for production by setting `WORKER_PASSWORD` in `.env.local` before re-seeding, or update the hash in Supabase.)

3. After seeding, **restart** your Next.js dev server.

4. Log in as owner and **immediately change the owner password** using the "Change Password (optional)" section in the `/orders` dashboard. Do this before going live.

## Changing the Owner Password Later

Once seeded, the owner can change their own password directly from the `/orders` page (owner mode only). No need to touch the database manually.

**Security (critical for live deployment):**
- Never use the default passwords (Pharr78577 / Worker78577) in production.
- Share the worker credentials only with trusted kitchen staff, preferably via a password manager or in person.
- After seeding in production, the owner must rotate their password right away.
- These accounts are for staff only. Public customers never log in — they use the public checkout on the homepage.

## Manual SQL (if you prefer not to run the script)

See the SQL statements in the main project documentation or run the seed script.
