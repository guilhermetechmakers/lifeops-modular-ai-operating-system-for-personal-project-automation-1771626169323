-- Extend cronjobs_dashboard for Cronjob Editor: automation levels, trigger types, dead-letter
-- Drop existing CHECK constraints and add extended values

ALTER TABLE cronjobs_dashboard DROP CONSTRAINT IF EXISTS cronjobs_dashboard_automation_level_check;
ALTER TABLE cronjobs_dashboard ADD CONSTRAINT cronjobs_dashboard_automation_level_check
  CHECK (automation_level IN (
    'full', 'assisted', 'manual',
    'suggest_only', 'approval_required', 'conditional_auto_execute', 'bounded_autopilot'
  ));

ALTER TABLE cronjobs_dashboard DROP CONSTRAINT IF EXISTS cronjobs_dashboard_trigger_type_check;
ALTER TABLE cronjobs_dashboard ADD CONSTRAINT cronjobs_dashboard_trigger_type_check
  CHECK (trigger_type IN ('cron', 'manual', 'webhook', 'time', 'event', 'conditional'));

-- Add dead_letter_policy JSONB for retry/dead-letter configuration
ALTER TABLE cronjobs_dashboard ADD COLUMN IF NOT EXISTS dead_letter_policy JSONB DEFAULT '{}';
