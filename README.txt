MAEKINI STORE - SUPABASE AND VERCEL

HOSTED STORE
------------------------------------------------
The storefront is a static site hosted on Vercel. Customer registration and
sign-in use Supabase Auth. Customer profile names are stored in the Supabase
`public.profiles` table, with row-level security so a signed-in customer can
read only their own profile.

Deployments are connected to the GitHub repository:
    https://github.com/angiliemaedrama-pixel/Maekini

Push changes to `main` to trigger a Vercel deployment. The production URL is:
    https://mae-kini.vercel.app

SUPABASE DATABASE SETUP
------------------------------------------------
1. Open the MaeKini project in the Supabase dashboard.
2. Open SQL Editor and run these migrations in order:
       supabase/migrations/20261109000000_create_profiles.sql
       supabase/migrations/20261109190000_owner_admin_store_controls.sql
3. In Authentication > URL Configuration, set the Site URL to:
       https://mae-kini.vercel.app
   Add this Redirect URL:
       https://mae-kini.vercel.app/**
4. In Authentication > Providers, ensure Email sign-in is enabled.

The owner migration assigns `angiliemaedrama@gmail.com` the `owner` role and
creates the secure products, orders, and store-links tables. Run it only after
that account exists in Supabase Auth. It seeds the existing 57-product catalog.
Never put a Supabase `service_role` or secret key in browser code.
`supabase-config.js` contains only the project URL and publishable key, which
are intended for public clients; row-level security protects owner operations.

ADMIN ACCOUNT MONITORING
------------------------------------------------
Sign in to the storefront as `angiliemaedrama@gmail.com`, open the Me tab, and
choose "Open owner dashboard" or visit `/admin.html`. The dashboard lists
customer profiles, manages products and visibility, updates order status, and
edits store social links. Customer account security and deletion remain in
Supabase Authentication > Users. No shared admin password is used.

STORE DATA
------------------------------------------------
Customer identity, product catalog, social links, and signed-in customer orders
use Supabase. Customers must sign in to place an order so the owner can manage
it. Cart contents, favorites, and product reviews remain in that customer's
browser and do not sync across devices.

Product images are static files under:
    assets/products/<product-id>/product.jpg

The floating 3D decoration is lazy-loaded from Three.js on first interaction.
No npm install or build step is required for the static Vercel deployment.

IMPORTANT
------------------------------------------------
Payment choices and order tracking are demonstrations only; the site does not
process real payments or connect to a courier.
