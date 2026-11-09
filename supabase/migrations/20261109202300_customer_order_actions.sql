create table if not exists public.store_order_requests (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.store_orders (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete restrict,
    request_type text not null check (request_type = 'Return/Refund'),
    item_id integer not null,
    item_name text not null check (char_length(btrim(item_name)) between 1 and 180),
    quantity integer not null check (quantity >= 1),
    reason text not null check (char_length(btrim(reason)) between 10 and 1000),
    status text not null default 'Pending'
        check (status in ('Pending', 'Approved', 'Declined')),
    reviewed_by uuid references auth.users (id) on delete set null,
    reviewed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists store_order_requests_order_created_idx
    on public.store_order_requests (order_id, created_at desc);

create unique index if not exists store_order_requests_one_active_item_idx
    on public.store_order_requests (order_id, item_id)
    where status in ('Pending', 'Approved');

alter table public.store_order_requests enable row level security;
grant select on public.store_order_requests to authenticated;

do $$
begin
    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
            and tablename = 'store_order_requests'
            and policyname = 'Customers can read their own order requests'
    ) then
        create policy "Customers can read their own order requests"
            on public.store_order_requests
            for select
            to authenticated
            using ((select auth.uid()) = user_id);
    end if;

    if not exists (
        select 1 from pg_policies
        where schemaname = 'public'
            and tablename = 'store_order_requests'
            and policyname = 'Store owner can read all order requests'
    ) then
        create policy "Store owner can read all order requests"
            on public.store_order_requests
            for select
            to authenticated
            using (public.is_store_owner());
    end if;
end;
$$;

create or replace function public.cancel_store_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_cancelled_id uuid;
begin
    if v_user_id is null then
        raise exception 'Sign in to cancel an order.';
    end if;

    update public.store_orders
    set status = 'Cancelled'
    where id = p_order_id
        and user_id = v_user_id
        and status = 'Preparing for Ship'
    returning id into v_cancelled_id;

    if v_cancelled_id is null then
        raise exception 'This order can no longer be cancelled. Cancellations are available before shipment.';
    end if;
end;
$$;

revoke all on function public.cancel_store_order(uuid) from public, anon;
grant execute on function public.cancel_store_order(uuid) to authenticated;

create or replace function public.request_store_order_return(
    p_order_id uuid,
    p_item_id integer,
    p_quantity integer,
    p_reason text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_user_id uuid := auth.uid();
    v_order_status text;
    v_item_name text;
    v_order_item_quantity integer;
    v_request_id uuid;
begin
    if v_user_id is null then
        raise exception 'Sign in to request a return or refund.';
    end if;

    if char_length(btrim(coalesce(p_reason, ''))) not between 10 and 1000 then
        raise exception 'Please provide a reason between 10 and 1000 characters.';
    end if;

    select order_record.status
    into v_order_status
    from public.store_orders as order_record
    where order_record.id = p_order_id
        and order_record.user_id = v_user_id;

    if not found or v_order_status <> 'Delivered' then
        raise exception 'A return or refund request is available only for your delivered orders.';
    end if;

    select max(item ->> 'name'), sum((item ->> 'qty')::integer)::integer
    into v_item_name, v_order_item_quantity
    from public.store_orders as order_record,
        jsonb_array_elements(order_record.items) as item
    where order_record.id = p_order_id
        and order_record.user_id = v_user_id
        and (item ->> 'id')::integer = p_item_id
    limit 1;

    if v_item_name is null or p_quantity is null
        or p_quantity not between 1 and v_order_item_quantity then
        raise exception 'Choose an item and a quantity included in this order.';
    end if;

    insert into public.store_order_requests (
        order_id, user_id, request_type, item_id, item_name, quantity, reason
    )
    values (
        p_order_id, v_user_id, 'Return/Refund', p_item_id, v_item_name, p_quantity, btrim(p_reason)
    )
    returning id into v_request_id;

    return v_request_id;
exception
    when unique_violation then
        raise exception 'A return or refund request is already pending for this order.';
end;
$$;

revoke all on function public.request_store_order_return(uuid, integer, integer, text) from public, anon;
grant execute on function public.request_store_order_return(uuid, integer, integer, text) to authenticated;

create or replace function public.review_store_order_request(
    p_request_id uuid,
    p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_owner_id uuid := auth.uid();
    v_request_id uuid;
begin
    if v_owner_id is null or not public.is_store_owner() then
        raise exception 'Only the store owner can review return or refund requests.';
    end if;

    if p_status is null or p_status not in ('Approved', 'Declined') then
        raise exception 'Choose an approved or declined decision.';
    end if;

    update public.store_order_requests
    set status = p_status,
        reviewed_by = v_owner_id,
        reviewed_at = now(),
        updated_at = now()
    where id = p_request_id
        and status = 'Pending'
    returning id into v_request_id;

    if v_request_id is null then
        raise exception 'This request is no longer pending.';
    end if;
end;
$$;

revoke all on function public.review_store_order_request(uuid, text) from public, anon;
grant execute on function public.review_store_order_request(uuid, text) to authenticated;

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
            and schemaname = 'public'
            and tablename = 'store_order_requests'
    ) then
        alter publication supabase_realtime add table public.store_order_requests;
    end if;
end;
$$;
