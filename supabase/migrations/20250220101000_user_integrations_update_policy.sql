-- Add UPDATE policy for user_integrations (required for upsert on connect)
CREATE POLICY "user_integrations_update_own" ON user_integrations
  FOR UPDATE USING (auth.uid() = user_id);
