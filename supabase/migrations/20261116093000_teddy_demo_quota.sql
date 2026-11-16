-- No messages, identities or fitness data: server-only aggregate usage counters.
create table public.teddy_chat_usage (
 bucket text primary key,
 requests integer not null default 0,
 expires_at timestamptz not null
);
alter table public.teddy_chat_usage enable row level security;
revoke all on public.teddy_chat_usage from public, anon, authenticated;
grant select, insert, update, delete on public.teddy_chat_usage to service_role;
create function public.teddy_chat_take_slot() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
 minute_key text := 'minute:' || to_char(now() at time zone 'UTC','YYYYMMDDHH24MI');
 day_key text := 'day:' || to_char(now() at time zone 'UTC','YYYYMMDD');
begin
 perform pg_advisory_xact_lock(483920176);
 delete from public.teddy_chat_usage where expires_at < now();
 if coalesce((select requests from public.teddy_chat_usage where bucket=minute_key),0) >= 12
 or coalesce((select requests from public.teddy_chat_usage where bucket=day_key),0) >= 100 then return false; end if;
 insert into public.teddy_chat_usage(bucket,requests,expires_at) values
 (minute_key,1,now()+interval '2 minutes'),(day_key,1,(date_trunc('day',now() at time zone 'UTC') at time zone 'UTC')+interval '1 day')
 on conflict(bucket) do update set requests=teddy_chat_usage.requests+1;
 return true;
end; $$;
revoke all on function public.teddy_chat_take_slot() from public, anon, authenticated;
grant execute on function public.teddy_chat_take_slot() to service_role;
