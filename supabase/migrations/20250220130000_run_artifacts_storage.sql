-- run_artifacts: metadata for S3-compatible object storage (Supabase Storage)
-- Stores run artifacts, diffs, logs, and exported artifacts with per-tenant access
CREATE TABLE IF NOT EXISTS run_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id UUID NOT NULL REFERENCES cronjob_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  artifact_type TEXT NOT NULL CHECK (artifact_type IN ('logs', 'diff', 'artifact', 'export')),
  filename TEXT NOT NULL,
  content_type TEXT DEFAULT 'application/octet-stream',
  size_bytes BIGINT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(run_id, artifact_type, filename)
);

CREATE INDEX IF NOT EXISTS idx_run_artifacts_run_id ON run_artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_run_artifacts_user_id ON run_artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_run_artifacts_expires_at ON run_artifacts(expires_at) WHERE expires_at IS NOT NULL;

ALTER TABLE run_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "run_artifacts_read_own" ON run_artifacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "run_artifacts_insert_own" ON run_artifacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "run_artifacts_delete_own" ON run_artifacts
  FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for run artifacts (Supabase Storage is S3-compatible)
-- Create bucket if storage schema exists. Bucket policies enforce per-tenant path: {user_id}/{run_id}/{type}/{filename}
-- Run: supabase storage create run-artifacts --private (or create via Dashboard)
