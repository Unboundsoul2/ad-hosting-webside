
/**
 * Configuration types for the application
 */

export interface PlatformInfo {
  type: 'web' | 'desktop' | 'mobile' | 'container';
  details: Record<string, any>;
  capabilities: string[];
}

export interface AppConfig {
  apiEndpoint: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'staging' | 'production';
  platformInfo: PlatformInfo;
  version: string;
  buildTimestamp: string;
  lastMigration?: string;
}

export interface UserConfigState {
  user_id: string;
  config: AppConfig;
  last_updated: string;
}
