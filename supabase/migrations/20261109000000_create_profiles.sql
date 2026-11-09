create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon;
grant select on table public.profiles to authenticated;

do $$
begin
    if not exists (
        select 1
        from pg_policies
        where schemaname = 'public'
            and tablename = 'profiles'
            and policyname = 'Users can read their own profile'
    ) then
        create policy "Users can read their own profile"
            on public.profiles
            for select
            to authenticated
            using ((select auth.uid()) = id);
    end if;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name)
    values (
        new.id,
        coalesce(
            nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
            nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
            'MaeKini customer'
        )
    );

    return new;
end;
$$;

do $$
begin
    if not exists (
        select 1
        from pg_trigger
        where tgname = 'on_auth_user_created'
            and tgrelid = 'auth.users'::regclass
            and not tgisinternal
    ) then
        create trigger on_auth_user_created
            after insert on auth.users
            for each row execute function public.handle_new_user();
    end if;
end;
$$;
