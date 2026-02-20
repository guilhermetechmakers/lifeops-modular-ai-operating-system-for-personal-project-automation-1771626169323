-- health_health_module table for Health module
CREATE TABLE IF NOT EXISTS health_health_module (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_health_module ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "health_health_module_read_own" ON health_health_module
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "health_health_module_insert_own" ON health_health_module
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "health_health_module_update_own" ON health_health_module
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "health_health_module_delete_own" ON health_health_module
  FOR DELETE USING (auth.uid() = user_id);
