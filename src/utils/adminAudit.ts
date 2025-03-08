
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/schema';

/**
 * Logs an admin action to the audit trail
 */
export const logAdminAction = async (
  adminUsername: string,
  action: string,
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    await supabase
      .from(Tables.ADMIN_AUDIT_LOGS)
      .insert({
        admin_username: adminUsername,
        action,
        details,
        // Convert Date to ISO string which is compatible with Supabase's timestamp type
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

/**
 * Retrieves the admin audit logs
 */
export const getAdminAuditLogs = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from(Tables.ADMIN_AUDIT_LOGS)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error retrieving admin audit logs:', error);
    return [];
  }
};
