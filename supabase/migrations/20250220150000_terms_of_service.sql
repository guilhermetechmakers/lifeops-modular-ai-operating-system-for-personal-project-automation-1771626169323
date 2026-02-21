-- terms_of_service table for user acceptance records
CREATE TABLE IF NOT EXISTS terms_of_service (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE terms_of_service ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "terms_of_service_read_own" ON terms_of_service
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "terms_of_service_insert_own" ON terms_of_service
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "terms_of_service_update_own" ON terms_of_service
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "terms_of_service_delete_own" ON terms_of_service
  FOR DELETE USING (auth.uid() = user_id);
