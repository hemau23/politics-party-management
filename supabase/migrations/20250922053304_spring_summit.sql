/*
  # Panna Pramukh Platform Database Schema

  1. New Tables
    - `users` - Store user profiles with roles (admin, panna_pramukh)
    - `booths` - Polling booth information
    - `panna_assignments` - Map panna pramukhs to booths
    - `voters` - Voter database with detailed information
    - `activities` - Track panna pramukh activities and interactions
    - `issues` - Local issues reported by voters
    - `metrics` - Calculated metrics for booth performance

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Admins can see all data
    - Panna pramukhs can only see their assigned data

  3. Features
    - Hierarchical booth assignments
    - Voter categorization and tracking
    - Activity logging with geo-tagging
    - Issue management
    - Performance metrics calculation
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'panna_pramukh');
CREATE TYPE voter_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE voting_history AS ENUM ('regular', 'irregular', 'first_time');
CREATE TYPE political_inclination AS ENUM ('supporter', 'swing', 'opposition');
CREATE TYPE activity_type AS ENUM ('visit', 'call', 'whatsapp', 'rally', 'issue', 'update');
CREATE TYPE issue_category AS ENUM ('road', 'water', 'electricity', 'other');
CREATE TYPE issue_status AS ENUM ('open', 'escalated', 'resolved');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL DEFAULT 'panna_pramukh',
  name text NOT NULL,
  phone text,
  email text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Booths table
CREATE TABLE IF NOT EXISTS booths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  constituency text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Panna assignments table
CREATE TABLE IF NOT EXISTS panna_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  booth_id uuid REFERENCES booths(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, booth_id)
);

-- Voters table
CREATE TABLE IF NOT EXISTS voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booth_id uuid REFERENCES booths(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 120),
  gender voter_gender NOT NULL,
  house_no text NOT NULL,
  family_members integer NOT NULL CHECK (family_members >= 1),
  phone text,
  whatsapp boolean DEFAULT false,
  voting_history voting_history NOT NULL,
  inclination political_inclination NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  voter_id uuid REFERENCES voters(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  description text NOT NULL,
  geo_tag text, -- Store as "lat,lng" format
  created_at timestamptz DEFAULT now()
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id uuid REFERENCES voters(id) ON DELETE CASCADE,
  category issue_category NOT NULL,
  description text NOT NULL,
  status issue_status DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- Metrics table (calculated/aggregated data)
CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booth_id uuid REFERENCES booths(id) ON DELETE CASCADE UNIQUE,
  coverage_percent integer DEFAULT 0 CHECK (coverage_percent >= 0 AND coverage_percent <= 100),
  supporter_percent integer DEFAULT 0 CHECK (supporter_percent >= 0 AND supporter_percent <= 100),
  swing_voters_count integer DEFAULT 0,
  opposition_count integer DEFAULT 0,
  youth_first_time_voters integer DEFAULT 0,
  issues_pending integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE panna_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Booths policies
CREATE POLICY "Authenticated users can read booths"
  ON booths FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage booths"
  ON booths FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Panna assignments policies
CREATE POLICY "Users can read own assignments"
  ON panna_assignments FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Admins can manage assignments"
  ON panna_assignments FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Voters policies
CREATE POLICY "Panna pramukhs can read assigned booth voters"
  ON voters FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM panna_assignments pa 
      WHERE pa.user_id::text = auth.uid()::text AND pa.booth_id = voters.booth_id
    )
  );

CREATE POLICY "Panna pramukhs can manage assigned booth voters"
  ON voters FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM panna_assignments pa 
      WHERE pa.user_id::text = auth.uid()::text AND pa.booth_id = voters.booth_id
    )
  );

-- Activities policies
CREATE POLICY "Users can read own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text OR EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

CREATE POLICY "Users can create own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

-- Issues policies
CREATE POLICY "Users can read relevant issues"
  ON issues FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM panna_assignments pa 
      JOIN voters v ON v.booth_id = pa.booth_id
      WHERE pa.user_id::text = auth.uid()::text AND v.id = issues.voter_id
    )
  );

CREATE POLICY "Users can create issues for assigned voters"
  ON issues FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM panna_assignments pa 
      JOIN voters v ON v.booth_id = pa.booth_id
      WHERE pa.user_id::text = auth.uid()::text AND v.id = issues.voter_id
    )
  );

-- Metrics policies
CREATE POLICY "Authenticated users can read metrics"
  ON metrics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage metrics"
  ON metrics FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_panna_assignments_user_id ON panna_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_panna_assignments_booth_id ON panna_assignments(booth_id);
CREATE INDEX IF NOT EXISTS idx_voters_booth_id ON voters(booth_id);
CREATE INDEX IF NOT EXISTS idx_voters_inclination ON voters(inclination);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_voter_id ON activities(voter_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
CREATE INDEX IF NOT EXISTS idx_issues_voter_id ON issues(voter_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_metrics_booth_id ON metrics(booth_id);

-- Insert sample data for demo

-- Sample admin user
INSERT INTO users (id, role, name, email, phone) VALUES 
('00000000-0000-0000-0000-000000000001', 'admin', 'Admin User', 'admin@example.com', '+91-9876543210')
ON CONFLICT (email) DO NOTHING;

-- Sample booths
INSERT INTO booths (id, name, location, constituency) VALUES 
('10000000-0000-0000-0000-000000000001', 'Booth 001', 'Gandhi Nagar', 'Melghat East'),
('10000000-0000-0000-0000-000000000002', 'Booth 002', 'Nehru Colony', 'Melghat East'),
('10000000-0000-0000-0000-000000000003', 'Booth 003', 'Ambedkar Ward', 'Melghat West')
ON CONFLICT (id) DO NOTHING;

-- Sample panna pramukh users
INSERT INTO users (id, role, name, email, phone) VALUES 
('20000000-0000-0000-0000-000000000001', 'panna_pramukh', 'Rajesh Kumar', 'rajesh@example.com', '+91-9876543211'),
('20000000-0000-0000-0000-000000000002', 'panna_pramukh', 'Priya Sharma', 'priya@example.com', '+91-9876543212'),
('20000000-0000-0000-0000-000000000003', 'panna_pramukh', 'Amit Patel', 'amit@example.com', '+91-9876543213')
ON CONFLICT (email) DO NOTHING;

-- Sample panna assignments
INSERT INTO panna_assignments (user_id, booth_id) VALUES 
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003')
ON CONFLICT (user_id, booth_id) DO NOTHING;

-- Sample voters
INSERT INTO voters (booth_id, name, age, gender, house_no, family_members, phone, whatsapp, voting_history, inclination) VALUES 
('10000000-0000-0000-0000-000000000001', 'Ramesh Gupta', 45, 'male', 'A-101', 4, '+91-9876543220', true, 'regular', 'supporter'),
('10000000-0000-0000-0000-000000000001', 'Sunita Devi', 38, 'female', 'A-102', 3, '+91-9876543221', true, 'regular', 'swing'),
('10000000-0000-0000-0000-000000000001', 'Vikash Singh', 25, 'male', 'A-103', 2, '+91-9876543222', false, 'first_time', 'supporter'),
('10000000-0000-0000-0000-000000000002', 'Meera Joshi', 52, 'female', 'B-201', 5, '+91-9876543223', true, 'irregular', 'opposition'),
('10000000-0000-0000-0000-000000000002', 'Suresh Yadav', 33, 'male', 'B-202', 3, '+91-9876543224', true, 'regular', 'supporter'),
('10000000-0000-0000-0000-000000000003', 'Kavita Sharma', 29, 'female', 'C-301', 2, '+91-9876543225', true, 'first_time', 'swing')
ON CONFLICT DO NOTHING;

-- Sample metrics (calculated from voters data)
INSERT INTO metrics (booth_id, coverage_percent, supporter_percent, swing_voters_count, opposition_count, youth_first_time_voters, issues_pending) VALUES 
('10000000-0000-0000-0000-000000000001', 85, 67, 1, 0, 1, 2),
('10000000-0000-0000-0000-000000000002', 72, 50, 0, 1, 0, 1),
('10000000-0000-0000-0000-000000000003', 90, 50, 1, 0, 1, 0)
ON CONFLICT (booth_id) DO UPDATE SET
  coverage_percent = EXCLUDED.coverage_percent,
  supporter_percent = EXCLUDED.supporter_percent,
  swing_voters_count = EXCLUDED.swing_voters_count,
  opposition_count = EXCLUDED.opposition_count,
  youth_first_time_voters = EXCLUDED.youth_first_time_voters,
  issues_pending = EXCLUDED.issues_pending,
  updated_at = now();