MAEKINI HOSTED PROJECT

This project is deployed from the GitHub repository:
https://github.com/angiliemaedrama-pixel/Maekini

Production site:
https://mae-kini.vercel.app

Customer sign-up and sign-in use Supabase Auth. The database migrations are at:
supabase/migrations/20261109000000_create_profiles.sql
supabase/migrations/20261109190000_owner_admin_store_controls.sql

The owner migration assigns `angiliemaedrama@gmail.com` the store-owner role.
Run both migrations in order after the account exists in Supabase Auth. The
owner dashboard at /admin.html manages the product catalog, signed-in orders,
and storefront social links. Manage account security through Supabase
Authentication > Users.
