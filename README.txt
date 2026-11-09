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
2. Open SQL Editor and run:
       supabase/migrations/20261109000000_create_profiles.sql
3. In Authentication > URL Configuration, set the Site URL to:
       https://mae-kini.vercel.app
   Add this Redirect URL:
       https://mae-kini.vercel.app/**
4. In Authentication > Providers, ensure Email sign-in is enabled.

The migration creates a profile row automatically for new Auth users and
enables row-level security. Never put a Supabase `service_role` or secret key
in browser code. `supabase-config.js` contains only the project URL and
publishable key, which are intended for public clients; database policies
protect the data.

ADMIN ACCOUNT MONITORING
------------------------------------------------
Open `/admin.html` on the deployed site, then choose the Supabase customer
accounts link. Sign in to Supabase with your project-owner account to view and
manage customers under Authentication > Users. The public website does not
contain a shared admin password.

STORE DATA
------------------------------------------------
Customer identity and profile names use Supabase. Cart contents, favorites,
orders, and product reviews are still stored in the customer's browser and do
not sync across devices or appear in the Supabase dashboard.

Product images are static files under:
    assets/products/<product-id>/product.jpg

The floating 3D decoration is lazy-loaded from Three.js on first interaction.
No npm install or build step is required for the static Vercel deployment.

IMPORTANT
------------------------------------------------
Payment choices and order tracking are demonstrations only; the site does not
process real payments or connect to a courier.
