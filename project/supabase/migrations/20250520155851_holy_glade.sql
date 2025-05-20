/*
  # Initial schema for Timetable Generator

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - role (text)
      - created_at (timestamptz)

    - subjects
      - id (uuid, primary key)
      - name (text)
      - code (text, unique)
      - credits (integer)
      - created_at (timestamptz)

    - teachers
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - subjects (text[])
      - availability (jsonb)
      - created_at (timestamptz)

    - classes
      - id (uuid, primary key)
      - name (text)
      - year (integer)
      - division (text)
      - subjects (text[])
      - created_at (timestamptz)

    - timetables
      - id (uuid, primary key)
      - name (text)
      - semester (text)
      - year (integer)
      - slots (jsonb)
      - created_by (uuid, references users)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  credits integer NOT NULL CHECK (credits > 0),
  created_at timestamptz DEFAULT now()
);

-- Create teachers table
CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  availability jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL CHECK (year > 0),
  division text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create timetables table
CREATE TABLE timetables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  semester text NOT NULL,
  year integer NOT NULL,
  slots jsonb NOT NULL DEFAULT '[]',
  created_by uuid REFERENCES users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subjects"
  ON subjects
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read teachers"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage teachers"
  ON teachers
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read classes"
  ON classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage classes"
  ON classes
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can read timetables"
  ON timetables
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own timetables"
  ON timetables
  USING (auth.uid() = created_by);