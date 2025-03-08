
// This file extends the Database types with custom tables
// Import these types when working with custom tables that aren't in the auto-generated types

export type AdminUser = {
  id: string;
  username: string;
  passphrase: string;
  two_factor_enabled: boolean;
  recovery_email: string | null;
  managed_sections: string[] | null;
  created_at: string;
  last_login: string | null;
}

export type AdminAuditLog = {
  id: string;
  admin_username: string;
  action: string;
  details: Record<string, any> | null;
  created_at: string;
}

export type WebsiteContent = {
  id: string;
  section: string;
  content: string;
  created_by: string;
  updated_by: string;
  created_at: string | null;
  updated_at: string | null;
}

export type AdminSetting = {
  id: string;
  key: string;
  value: Record<string, any>;
  updated_by: string;
  updated_at: string;
}

export type AdminStat = {
  id: string;
  category: string;
  metric: string;
  value: number | Record<string, any>;
  period: string;
  recorded_at: string;
}

// Use this instead of directly passing table names
export const Tables = {
  PROFILES: 'profiles' as const,
  ADMIN_USERS: 'admin_users' as const,
  ADMIN_AUDIT_LOGS: 'admin_audit_logs' as const,
  USER_CONFIG_STATES: 'user_config_states' as const,
  WEBSITE_CONTENT: 'website_content' as const,
  ADMIN_SETTINGS: 'admin_settings' as const,
  ADMIN_STATS: 'admin_stats' as const
};
