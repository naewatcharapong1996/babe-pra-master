create table media_assets (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url   text not null,
  name         text not null,
  mime_type    text not null,
  size_bytes   bigint not null,
  created_at   timestamptz not null default now()
);

alter table media_assets enable row level security;
-- No policies, same model as page_sections: only the service_role key
-- (server-side) reads/writes this table; anon/authenticated get nothing.
