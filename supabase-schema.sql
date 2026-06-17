-- =============================================
-- WEDDING SITE — Rossella & Antonio
-- Schema già applicato al progetto Supabase rqbilxlpcdskmtbevktn
-- Qui per riferimento / ripristino
-- =============================================

CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer DEFAULT 8
);

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text, phone text,
  attending boolean,
  arrival_day date, departure_day date,
  transport text CHECK (transport IN ('car','train','plane','shuttle','other')),
  plus_one boolean DEFAULT false,
  plus_one_name text,
  dietary_guest text[] DEFAULT '{}',
  dietary_plus_one text[] DEFAULT '{}',
  notes text,
  table_id uuid REFERENCES tables(id) ON DELETE SET NULL,
  confirmed boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  category text CHECK (category IN ('venue','catering','flowers','photo_video','music','attire','transport','honeymoon','stationery','other')),
  vendor text NOT NULL DEFAULT '',
  description text DEFAULT '',
  total_cost numeric(10,2) DEFAULT 0,
  deposit_paid numeric(10,2) DEFAULT 0,
  due_date date, notes text,
  paid boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  task text NOT NULL,
  due_date date,
  done boolean DEFAULT false,
  category text CHECK (category IN ('12_months','9_months','6_months','3_months','1_month','1_week','day_of')),
  priority text CHECK (priority IN ('high','medium','low')) DEFAULT 'medium'
);

CREATE TABLE IF NOT EXISTS song_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  guest_name text,
  spotify_id text NOT NULL,
  track_name text NOT NULL,
  artist_name text NOT NULL,
  playlist text CHECK (playlist IN ('wedding','karaoke')) NOT NULL,
  added boolean DEFAULT false
);
