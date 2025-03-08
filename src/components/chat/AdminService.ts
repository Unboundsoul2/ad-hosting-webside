import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/schema';
import { logAdminAction } from '@/utils/adminAudit';

export type AdminState = {
  isAdmin: boolean;
  username?: string;
};

export type PatriotData = {
  username: string;
  passphrase: string;
  twoFactor: boolean;
  recoveryEmail: string;
  sections: string;
};

export const checkForAdminCommands = async (text: string): Promise<boolean> => {
  const trimmedText = text.trim().toLowerCase();
  
  if (trimmedText === 'activate patriot mode') {
    try {
      const { data, error } = await supabase
        .from(Tables.ADMIN_USERS)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error checking admin users:', error);
        return false;
      }
      
      return !data || data.length === 0;
    } catch (err) {
      console.error('Error in checkForAdminCommands:', err);
      return false;
    }
  }
  
  return false;
};

export const verifyAdminLogin = async (passphrase: string): Promise<{ verified: boolean; username?: string }> => {
  const { data, error } = await supabase
    .from(Tables.ADMIN_USERS)
    .select('username, passphrase')
    .eq('passphrase', passphrase)
    .single();
  
  if (data && !error) {
    await logAdminAction(data.username, 'Admin Login', { method: 'passphrase' });
    
    await supabase
      .from(Tables.ADMIN_USERS)
      .update({ last_login: new Date().toISOString() })
      .eq('username', data.username);
      
    return { verified: true, username: data.username };
  }
  
  return { verified: false };
};

export const createAdminUser = async (patriotData: PatriotData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(Tables.ADMIN_USERS)
      .insert([{
        username: patriotData.username,
        passphrase: patriotData.passphrase,
        two_factor_enabled: patriotData.twoFactor,
        recovery_email: patriotData.recoveryEmail,
        managed_sections: patriotData.sections.split(',').map(s => s.trim())
      }]);
    
    if (error) {
      console.error('Error creating admin user:', error);
      return false;
    }
    
    await logAdminAction(patriotData.username, 'Admin Creation', {
      method: 'Patriot Mode',
      twoFactorEnabled: patriotData.twoFactor,
      managedSections: patriotData.sections.split(',').map(s => s.trim())
    });
    
    return true;
  } catch (err) {
    console.error('Error in createAdminUser:', err);
    return false;
  }
};

export const uploadAdminFile = async (
  file: File, 
  adminUsername: string
): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from('admin_uploads')
      .upload(`${adminUsername}/${Date.now()}_${file.name}`, file);
    
    if (error) throw error;
    
    await logAdminAction(adminUsername, 'File Upload', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: data?.path
    });
    
    return { success: true, path: data?.path };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
