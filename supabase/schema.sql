-- Mock Patient Profile (ABHA-linked)
create table patients (
  id uuid primary key default gen_random_uuid(),
  abha_id text unique,
  name text not null,
  dob date not null,
  gender text check (gender in ('M', 'F', 'O')),
  blood_group text,
  created_at timestamptz default now()
);

-- Unified Health Record (FHIR-lite JSONB for flexibility)
create table health_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  record_type text check (record_type in ('lab_report', 'prescription', 'discharge_summary')),
  file_name text,
  extracted_data jsonb not null,
  created_at timestamptz default now()
);

-- AI Insights & Summaries
create table health_insights (
  id uuid primary key default gen_random_uuid(),
  record_id uuid references health_records(id) on delete cascade,
  summary_en text not null,
  summary_regional text,
  abnormal_flags jsonb,
  disclaimer_acknowledged boolean default true,
  created_at timestamptz default now()
);

alter table patients enable row level security;
alter table health_records enable row level security;
alter table health_insights enable row level security;
