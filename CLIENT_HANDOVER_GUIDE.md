# Dream Cafe Beri — Production Handover & Owner Admin Guide

Welcome to the **Dream Cafe Professional Web Platform with Autonomous Owner Admin Dashboard**.

---

## 1. Live Website Links

- **Local Development URL**: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Owner Admin Portal Direct Access**: [http://127.0.0.1:5173/?admin=true](http://127.0.0.1:5173/?admin=true) (or via the discrete "Owner Portal" link in the footer)

---

## 2. Customer Browsing Experience (No Login Required)

Customers can browse the entire website without any friction:
- **Interactive 3D Centerpiece & 360° Food Studio**: Real-time WebGL models with mouse/touch rotation.
- **Full Menu & Dynamic Pricing**: Browse all 70+ items across 13 categories, search by keywords, filter by 100% Veg or Spicy.
- **Live Business Information**: Opening hours, address at Lala Ram Sarup Memorial Park (Beri), and one-touch click-to-call (`tel:+918278233573`).
- **Interactive Map & Directions**: Instant Google Maps navigation directions.

---

## 3. Discrete Owner Login & Security Architecture

### Strict Security Principles
- **No Public Admin URL Exposed**: Admin options are discrete in the footer and via URL parameter `?admin=true`.
- **Email Whitelist Verification**: Only pre-authorized email addresses can request access tokens or OTP codes.
- **Authorization Beyond Email Verification**: In accordance with security standards, **email verification alone never grants admin access**. The user's email/UID must explicitly exist in the authorized admin database whitelist (`admin_users` table) with the `owner` role.
- **Session Expiration**: Automatic 24-hour cryptographic session invalidation.

### Authorized Default Owner Email:
- **Email**: `owner@dreamcafe.in`
- **Development Demo Mode**: If Supabase is not yet connected, entering this email displays the instant 6-digit test PIN (`827823`) on screen for local preview.

---

## 4. Owner Admin Dashboard Capabilities

The owner can independently manage the cafe content without AntiGravity:
1. **Menu Item Manager**:
   - Add new dishes with name, category, price, description, image URL, and badges (e.g. "Chef Special", "Super Crunch").
   - Edit prices, descriptions, and dietary flags (Spicy, Popular, Veg).
   - Delete items permanently with safety confirmation.
2. **Cafe Information & Operating Hours**:
   - Update opening hours, telephone number, address, and Google Maps URL.
   - All changes immediately reflect on the live customer-facing website.
3. **Storage Modes**:
   - **Local Persistent Storage**: Works out of the box with zero external dependencies.
   - **Supabase Cloud Database**: Seamless real-time sync with PostgreSQL and Row Level Security when configured.

---

## 5. Connecting Supabase for Production (Step-by-Step)

To connect Supabase for cloud database persistence:

1. **Create Supabase Project**:
   - Sign up at [https://supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Schema**:
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy the contents of `supabase/schema.sql` and click **Run**.
   - This sets up `menu_items`, `cafe_settings`, `admin_users`, and strict **Row Level Security (RLS)** policies.
3. **Authorize the Client's Owner Email**:
   - In the SQL Editor, execute:
     ```sql
     INSERT INTO public.admin_users (email, role)
     VALUES ('client-owner@example.com', 'owner');
     ```
4. **Add Environment Variables**:
   - Create a `.env` file in the project root:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-public-key
     ```
   - Restart the Vite server: `npm run dev`.

---

## 6. How to Reuse for Future Small Business Clients

This project was built with a modular, reusable architecture. To adapt it for a new restaurant or cafe client:

1. Open `src/config/siteConfig.ts`.
2. Update the brand name, address, phone number, Google Maps link, and `authorizedOwnerEmails`:
   ```typescript
   export const SITE_CONFIG: SiteConfig = {
     brandName: 'New Cafe Name',
     locationName: 'City, State',
     fullAddress: 'Full street address...',
     phone: '+91 XXXXX XXXXX',
     phoneTel: 'tel:+91XXXXXXXXXX',
     defaultOpeningHours: 'Opens daily at 9:00 AM',
     googleMapsUrl: 'https://maps.google.com/?q=...',
     authorizedOwnerEmails: ['newowner@cafe.com'],
     socialLinks: { ... }
   };
   ```
3. Run `npm run build` — the entire platform is now customized for the new client!

---

## 7. Production Deployment (Vercel / Netlify / Firebase)

### Deploying to Vercel:
```bash
npm install -g vercel
vercel
```

### Deploying to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Build command: `npm run build`  
Output directory: `dist`
