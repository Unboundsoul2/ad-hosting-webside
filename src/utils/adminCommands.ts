import { logAdminAction } from './adminAudit';
import { supabase } from '@/integrations/supabase/client';
import { Tables, WebsiteContent } from '@/integrations/supabase/schema';

// Website content management storage key
const SITE_CONTENT_KEY = 'website_content';

/**
 * Updates the website content in the database
 */
const updateWebsiteContent = async (section: string, content: string, adminUsername: string) => {
  try {
    // Get current website content
    const { data: existingData, error: fetchError } = await supabase
      .from(Tables.WEBSITE_CONTENT)
      .select('*')
      .eq('section', section)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the error code for "no rows returned" which is expected if content doesn't exist yet
      console.error('Error fetching website content:', fetchError);
      return { success: false, error: 'Failed to fetch website content' };
    }
    
    // If content exists, update it. Otherwise, insert new content.
    if (existingData) {
      const { error: updateError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .update({
          content,
          updated_by: adminUsername,
          updated_at: new Date().toISOString()
        })
        .eq('section', section);
        
      if (updateError) {
        console.error('Error updating website content:', updateError);
        return { success: false, error: 'Failed to update website content' };
      }
    } else {
      const { error: insertError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .insert({
          section,
          content,
          created_by: adminUsername,
          updated_by: adminUsername,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error('Error inserting website content:', insertError);
        return { success: false, error: 'Failed to insert website content' };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating website content:', error);
    return { success: false, error: 'Failed to update website content' };
  }
};

/**
 * Handles the update homepage banner command
 */
export const handleUpdateHomepageBanner = async (adminUsername: string, bannerContent?: string) => {
  await logAdminAction(
    adminUsername, 
    'Homepage Banner Update Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (bannerContent) {
    const result = await updateWebsiteContent('homepage_banner', bannerContent, adminUsername);
    if (result.success) {
      return "Homepage banner updated successfully!";
    } else {
      return `Error updating homepage banner: ${result.error}`;
    }
  }
  
  return "I'll help you update the homepage banner. Please provide the new content or upload an image.";
};

/**
 * Handles the modify site settings command
 */
export const handleModifySiteSettings = async (adminUsername: string, settings?: Record<string, any>) => {
  await logAdminAction(
    adminUsername, 
    'Site Settings Modification Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (settings) {
    const result = await updateWebsiteContent('site_settings', JSON.stringify(settings), adminUsername);
    if (result.success) {
      return "Site settings updated successfully!";
    } else {
      return `Error updating site settings: ${result.error}`;
    }
  }
  
  return "Opening site settings panel. What specific settings would you like to modify?";
};

/**
 * Handles the enable maintenance mode command
 */
export const handleEnableMaintenanceMode = async (adminUsername: string, enabled?: boolean) => {
  await logAdminAction(
    adminUsername, 
    enabled ? 'Maintenance Mode Enabled' : 'Maintenance Mode Configuration', 
    { timestamp: new Date().toISOString() }
  );
  
  if (enabled !== undefined) {
    const settings = { maintenanceMode: enabled, updatedAt: new Date().toISOString() };
    const result = await updateWebsiteContent('maintenance_mode', JSON.stringify(settings), adminUsername);
    if (result.success) {
      return enabled 
        ? "Maintenance mode enabled. The site will display a maintenance message to visitors."
        : "Maintenance mode disabled. The site is now accessible to all visitors.";
    } else {
      return `Error updating maintenance mode: ${result.error}`;
    }
  }
  
  return "Maintenance mode enabled. The site will display a maintenance message to visitors.";
};

/**
 * Handles the file upload command
 */
export const handleFileUploadCommand = async (adminUsername: string, file?: File) => {
  await logAdminAction(
    adminUsername, 
    'File Upload Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (file) {
    try {
      const { data, error } = await supabase.storage
        .from('admin_uploads')
        .upload(`${adminUsername}/${Date.now()}_${file.name}`, file);
      
      if (error) throw error;
      
      await logAdminAction(adminUsername, 'File Upload Completed', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storagePath: data?.path
      });
      
      return `File "${file.name}" uploaded successfully!`;
    } catch (error) {
      console.error('Error uploading file:', error);
      return "Error uploading file. Please try again.";
    }
  }
  
  return "Please select a file to upload.";
};

/**
 * Handles updating page content
 */
export const handleUpdatePageContent = async (adminUsername: string, pageName?: string, content?: string) => {
  await logAdminAction(
    adminUsername, 
    'Page Content Update Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (pageName && content) {
    const result = await updateWebsiteContent(`page_${pageName.toLowerCase().replace(/\s+/g, '_')}`, content, adminUsername);
    if (result.success) {
      return `Content for page "${pageName}" updated successfully!`;
    } else {
      return `Error updating page content: ${result.error}`;
    }
  }
  
  return "Which page would you like to update? Please provide the page name or URL.";
};

/**
 * Handles deleting page content
 */
export const handleDeletePageContent = async (adminUsername: string, pageName?: string) => {
  await logAdminAction(
    adminUsername, 
    'Page Content Deletion Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (pageName) {
    try {
      const sectionKey = `page_${pageName.toLowerCase().replace(/\s+/g, '_')}`;
      const { error } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .delete()
        .eq('section', sectionKey);
      
      if (error) throw error;
      
      await logAdminAction(adminUsername, 'Page Content Deleted', {
        pageName,
        sectionKey,
        timestamp: new Date().toISOString()
      });
      
      return `Content for page "${pageName}" deleted successfully!`;
    } catch (error) {
      console.error('Error deleting page content:', error);
      return "Error deleting page content. Please try again.";
    }
  }
  
  return "Which page or content would you like to delete? Please provide specific details.";
};

/**
 * Handles modifying website styles
 */
export const handleModifyStyles = async (adminUsername: string, styleUpdates?: Record<string, any>) => {
  await logAdminAction(
    adminUsername, 
    'Website Style Modification Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (styleUpdates) {
    const result = await updateWebsiteContent('site_styles', JSON.stringify(styleUpdates), adminUsername);
    if (result.success) {
      return "Website styles updated successfully!";
    } else {
      return `Error updating website styles: ${result.error}`;
    }
  }
  
  return "Which style elements would you like to modify? (colors, fonts, layout, etc.)";
};

/**
 * Handles system configuration
 */
export const handleSystemConfiguration = async (adminUsername: string, config?: Record<string, any>) => {
  await logAdminAction(
    adminUsername, 
    'System Configuration Initiated', 
    { timestamp: new Date().toISOString() }
  );
  
  if (config) {
    const result = await updateWebsiteContent('system_config', JSON.stringify(config), adminUsername);
    if (result.success) {
      return "System configuration updated successfully!";
    } else {
      return `Error updating system configuration: ${result.error}`;
    }
  }
  
  return "What system settings would you like to configure? (performance, security, integrations, etc.)";
};

/**
 * Executes an admin command with specific parameters
 */
export const executeAdminCommand = async (
  adminUsername: string,
  command: string,
  params: Record<string, any>
): Promise<string> => {
  const normalizedCommand = command.toLowerCase().trim();
  
  try {
    switch (normalizedCommand) {
      case 'update homepage banner':
        return await handleUpdateHomepageBanner(adminUsername, params.content);
        
      case 'modify site settings':
        return await handleModifySiteSettings(adminUsername, params.settings);
        
      case 'enable maintenance mode':
        return await handleEnableMaintenanceMode(adminUsername, params.enabled);
        
      case 'upload file':
        return await handleFileUploadCommand(adminUsername, params.file);
        
      case 'update page content':
        return await handleUpdatePageContent(adminUsername, params.pageName, params.content);
        
      case 'delete page content':
        return await handleDeletePageContent(adminUsername, params.pageName);
        
      case 'modify website styles':
        return await handleModifyStyles(adminUsername, params.styles);
        
      case 'configure system settings':
        return await handleSystemConfiguration(adminUsername, params.config);
        
      default:
        return "Command not recognized. Please try again with a valid command.";
    }
  } catch (error) {
    console.error('Error executing admin command:', error);
    return "An error occurred while executing the command. Please try again.";
  }
};
