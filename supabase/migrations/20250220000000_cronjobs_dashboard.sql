-- Extended cronjobs_dashboard table with full cronjob fields
CREATE TABLE IF NOT EXISTS cronjobs_dashboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  schedule TEXT NOT NULL DEFAULT '0 9 * * *',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  target TEXT NOT NULL,
  automation_level TEXT NOT NULL DEFAULT 'assisted' CHECK (automation_level IN ('full', 'assisted', 'manual')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'draft')),
  trigger_type TEXT NOT NULL DEFAULT 'cron' CHECK (trigger_type IN ('cron', 'manual', 'webhook')),
  payload JSONB DEFAULT '{}',
  constraints JSONB DEFAULT '[]',
  safety_rails JSONB DEFAULT '[]',
  retry_policy JSONB DEFAULT '{"max_retries": 3, "backoff_ms": 1000}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cronjobs_dashboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cronjobs_dashboard_read_own" ON cronjobs_dashboard
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cronjobs_dashboard_insert_own" ON cronjobs_dashboard
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cronjobs_dashboard_update_own" ON cronjobs_dashboard
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cronjobs_dashboard_delete_own" ON cronjobs_dashboard
  FOR DELETE USING (auth.uid() = user_id);

-- Cronjob runs table for run history
CREATE TABLE IF NOT EXISTS cronjob_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cronjob_id UUID REFERENCES cronjobs_dashboard(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'running', 'pending')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  logs TEXT,
  artifacts JSONB DEFAULT '{}',
  error TEXT
);

ALTER TABLE cronjob_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cronjob_runs_read_own" ON cronjob_runs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM cronjobs_dashboard WHERE id = cronjob_id AND user_id = auth.uid())
  );

-- Cronjob permissions table
CREATE TABLE IF NOT EXISTS cronjob_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cronjob_id UUID REFERENCES cronjobs_dashboard(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  can_edit BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  can_run BOOLEAN DEFAULT false,
  UNIQUE(cronjob_id, user_id)
);

ALTER TABLE cronjob_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cronjob_permissions_read_own" ON cronjob_permissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM cronjobs_dashboard WHERE id = cronjob_id AND user_id = auth.uid())
  );

CREATE POLICY "cronjob_permissions_insert_own" ON cronjob_permissions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM cronjobs_dashboard WHERE id = cronjob_id AND user_id = auth.uid())
  );

CREATE POLICY "cronjob_permissions_update_own" ON cronjob_permissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM cronjobs_dashboard WHERE id = cronjob_id AND user_id = auth.uid())
  );

CREATE POLICY "cronjob_permissions_delete_own" ON cronjob_permissions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM cronjobs_dashboard WHERE id = cronjob_id AND user_id = auth.uid())
  );
