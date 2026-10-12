-- MediMind AI - Supabase Schema
-- ABDM / FHIR Compliant Health Copilot Database

create extension if not exists "pgcrypto";

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  abha_id text unique,
  name text not null,
  dob date not null,
  gender text check (gender in ('M', 'F', 'O')),
  blood_group text,
  created_at timestamptz default now()
);

create table if not exists health_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  record_type text check (record_type in ('lab_report', 'prescription', 'discharge_summary')),
  file_name text,
  file_url text,
  extracted_data jsonb not null,
  created_at timestamptz default now()
);

create table if not exists health_insights (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references health_records(id) on delete cascade,
  summary_en text not null,
  summary_hi text,
  abnormal_flags jsonb,
  recommendations text[],
  questions_for_doctor text[],
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table patients enable row level security;
alter table health_records enable row level security;
alter table health_insights enable row level security;

-- Policies for public demo / authenticated users
create policy "Allow all operations on patients" on patients for all using (true) with check (true);
create policy "Allow all operations on health_records" on health_records for all using (true) with check (true);
create policy "Allow all operations on health_insights" on health_insights for all using (true) with check (true);

-- Seed Initial Demo Patient
insert into patients (id, abha_id, name, dob, gender, blood_group)
values (
  'a0000000-0000-0000-0000-000000000001',
  '91-2345-6789-0123',
  'Aarav Sharma',
  '1989-04-12',
  'M',
  'O+'
) on conflict (abha_id) do nothing;
