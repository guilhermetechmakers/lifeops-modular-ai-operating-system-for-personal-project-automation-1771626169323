-- master_dashboard table for user dashboard config/preferences
CREATE TABLE IF NOT EXISTS master_dashboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE master_dashboard ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "master_dashboard_read_own" ON master_dashboard
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "master_dashboard_insert_own" ON master_dashboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "master_dashboard_update_own" ON master_dashboard
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "master_dashboard_delete_own" ON master_dashboard
  FOR DELETE USING (auth.uid() = user_id);
