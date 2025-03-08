
-- Tables for cross-platform migration functionality

-- Stores user configuration states for each platform
CREATE TABLE IF NOT EXISTS user_config_states (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Stores detailed project states for migration
CREATE TABLE IF NOT EXISTS user_project_states (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  state JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  platform_info JSONB,
  imported_from VARCHAR(255),
  UNIQUE(user_id)
);

-- Logs user activity for analysis and continuity
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB,
  route VARCHAR(255)
);

-- Stores migration codes for easy project transfer
CREATE TABLE IF NOT EXISTS migration_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(12) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Tracks migration history for AI-assisted restoration
CREATE TABLE IF NOT EXISTS migration_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_platform VARCHAR(255) NOT NULL,
  target_platform VARCHAR(255) NOT NULL,
  migration_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  version VARCHAR(50)
);

-- Create helper function for upserting config
CREATE OR REPLACE FUNCTION upsert_user_config(
  p_user_id UUID,
  p_config JSONB,
  p_last_updated TIMESTAMP WITH TIME ZONE
) RETURNS VOID AS $$
BEGIN
  INSERT INTO user_config_states (user_id, config, last_updated)
  VALUES (p_user_id, p_config, p_last_updated)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    config = p_config,
    last_updated = p_last_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up RLS policies
ALTER TABLE user_config_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_project_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_history ENABLE ROW LEVEL SECURITY;

-- User can only see and modify their own data
CREATE POLICY "Users can view their own config states" 
  ON user_config_states FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own config states" 
  ON user_config_states FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own config states" 
  ON user_config_states FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables
CREATE POLICY "Users can view their own project states" 
  ON user_project_states FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own project states" 
  ON user_project_states FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project states" 
  ON user_project_states FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity logs" 
  ON user_activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs" 
  ON user_activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own migration codes" 
  ON migration_codes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own migration codes" 
  ON migration_codes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own migration history" 
  ON migration_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own migration history" 
  ON migration_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to generate unique migration codes
CREATE OR REPLACE FUNCTION generate_migration_code() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.code := 'MIG-' || UPPER(SUBSTRING(MD5(NEW.user_id::text || EXTRACT(EPOCH FROM NOW())::text) FROM 1 FOR 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate migration codes
CREATE TRIGGER set_migration_code
BEFORE INSERT ON migration_codes
FOR EACH ROW
EXECUTE FUNCTION generate_migration_code();
