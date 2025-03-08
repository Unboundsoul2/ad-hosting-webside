
import { supabase } from '@/integrations/supabase/client';
import { logAdminAction } from '@/utils/adminAudit';

export interface FileObject {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export const fetchFilesFromStorage = async (adminUsername: string): Promise<FileObject[]> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('admin_uploads')
      .list(adminUsername, {
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error) {
      throw error;
    }
    
    if (data) {
      return data.map(file => ({
        name: file.name,
        id: file.id,
        updated_at: file.updated_at,
        created_at: file.created_at,
        last_accessed_at: file.last_accessed_at || '',
        metadata: {
          size: file.metadata?.size || 0,
          mimetype: file.metadata?.mimetype || ''
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

export const uploadFileToStorage = async (
  file: File, 
  adminUsername: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  try {
    const filePath = `${adminUsername}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('admin_uploads')
      .upload(filePath, file);
    
    if (error) {
      throw error;
    }
    
    await logAdminAction(adminUsername, 'File Uploaded', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      storagePath: data?.path
    });
    
    onSuccess();
    return true;
  } catch (error) {
    console.error('Error uploading file:', error);
    onError('There was an error uploading your file.');
    return false;
  }
};

export const deleteFileFromStorage = async (
  fileName: string,
  adminUsername: string,
  onSuccess: () => void,
  onError: (message: string) => void
) => {
  try {
    const filePath = `${adminUsername}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('admin_uploads')
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    await logAdminAction(adminUsername, 'File Deleted', {
      fileName,
      timestamp: new Date().toISOString()
    });
    
    onSuccess();
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    onError('There was an error deleting the file.');
    return false;
  }
};

export const getFilePublicUrl = (fileName: string, adminUsername: string): string => {
  const filePath = `${adminUsername}/${fileName}`;
  return supabase.storage.from('admin_uploads').getPublicUrl(filePath).data.publicUrl;
};
