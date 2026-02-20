-- user_profile table (extended for Profile Card, Account Settings)
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL DEFAULT 'Member',
  description TEXT,
  status TEXT DEFAULT 'active',
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Member',
  organization TEXT,
  email TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "user_profile_read_own" ON user_profile
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "user_profile_insert_own" ON user_profile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "user_profile_update_own" ON user_profile
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "user_profile_delete_own" ON user_profile
  FOR DELETE USING (auth.uid() = user_id);

-- user_integrations for connected services
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id TEXT NOT NULL,
  name TEXT NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, integration_id)
);

ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_integrations_read_own" ON user_integrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_integrations_insert_own" ON user_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_integrations_delete_own" ON user_integrations
  FOR DELETE USING (auth.uid() = user_id);

-- user_api_keys for API key management
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scope JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_api_keys_read_own" ON user_api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_api_keys_insert_own" ON user_api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_api_keys_update_own" ON user_api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_api_keys_delete_own" ON user_api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- user_activity_log for audit trail
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_activity_log_read_own" ON user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_activity_log_insert_own" ON user_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
