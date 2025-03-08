import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ContentEditor } from '../content/ContentEditor';
import { supabase } from '@/integrations/supabase/client';
import { Tables, AdminSetting } from '@/integrations/supabase/schema';
import { logAdminAction } from '@/utils/adminAudit';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, RefreshCw } from 'lucide-react';

interface SettingsProps {
  adminUsername: string;
}

export const AdminSettings: React.FC<SettingsProps> = ({ adminUsername }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    site: {
      title: 'Admin Dashboard',
      description: 'Admin dashboard for managing website content',
      maintenanceMode: false
    },
    display: {
      theme: 'system',
      primaryColor: 'blue',
      showTour: true
    },
    admin: {
      auditLog: true,
      uploadSize: 10
    }
  });
  const { toast } = useToast();
  
  const fetchSettings = async () => {
    setIsLoading(true);
    
    try {
      // For admin_settings, use a workaround since it might not be in the types yet
      const { data, error } = await (supabase as any)
        .from(Tables.ADMIN_SETTINGS)
        .select('*')
        .eq('key', 'theme_settings');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const themeSettings = data[0] as AdminSetting;
        setSettings({
          ...settings,
          display: {
            ...settings.display,
            ...themeSettings.value
          }
        });
      }
      
      // Fetch maintenance mode setting
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('content')
        .eq('section', 'maintenance_mode')
        .single();
      
      if (!maintenanceError && maintenanceData) {
        try {
          const maintenanceSettings = JSON.parse(maintenanceData.content);
          setSettings({
            ...settings,
            site: {
              ...settings.site,
              maintenanceMode: maintenanceSettings.maintenanceMode || false
            }
          });
        } catch (e) {
          console.error('Error parsing maintenance settings:', e);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load settings. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Update theme settings using a workaround for the type
      const { error: themeError } = await (supabase as any)
        .from(Tables.ADMIN_SETTINGS)
        .upsert({
          key: 'theme_settings',
          value: settings.display,
          updated_by: adminUsername,
          updated_at: new Date().toISOString()
        });
      
      if (themeError) {
        throw themeError;
      }
      
      // Update maintenance mode
      const maintenanceSettings = {
        maintenanceMode: settings.site.maintenanceMode,
        updatedAt: new Date().toISOString()
      };
      
      // Using the website content table for maintenance mode
      const { data: existingData, error: checkError } = await supabase
        .from(Tables.WEBSITE_CONTENT)
        .select('*')
        .eq('section', 'maintenance_mode')
        .single();
      
      if (existingData) {
        // Update existing maintenance mode record
        const { error: updateError } = await supabase
          .from(Tables.WEBSITE_CONTENT)
          .update({
            content: JSON.stringify(maintenanceSettings),
            updated_by: adminUsername,
            updated_at: new Date().toISOString()
          })
          .eq('section', 'maintenance_mode');
        
        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new maintenance mode record
        const { error: insertError } = await supabase
          .from(Tables.WEBSITE_CONTENT)
          .insert({
            section: 'maintenance_mode',
            content: JSON.stringify(maintenanceSettings),
            created_by: adminUsername,
            updated_by: adminUsername,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          throw insertError;
        }
      }
      
      await logAdminAction(adminUsername, 'Settings Updated', {
        sections: ['theme', 'maintenance'],
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'Settings Saved',
        description: 'Your settings have been updated successfully.'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={isLoading || isSaving}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-none md:flex">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Site Content</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Switch
                      id="maintenance-mode"
                      checked={settings.site.maintenanceMode}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          site: { ...settings.site, maintenanceMode: checked }
                        })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the site will display a maintenance message to all visitors.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-audit">Enable Audit Log</Label>
                    <Switch
                      id="enable-audit"
                      checked={settings.admin.auditLog}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          admin: { ...settings.admin, auditLog: checked }
                        })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track all admin actions in the audit log.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="upload-size">Maximum Upload Size (MB)</Label>
                  <Input
                    id="upload-size"
                    type="number"
                    min="1"
                    max="100"
                    value={settings.admin.uploadSize}
                    onChange={(e) => 
                      setSettings({
                        ...settings,
                        admin: { ...settings.admin, uploadSize: parseInt(e.target.value) || 10 }
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Set the maximum file size for uploads (in megabytes).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <Button
                        key={theme}
                        type="button"
                        variant={settings.display.theme === theme ? 'default' : 'outline'}
                        className="capitalize"
                        onClick={() => 
                          setSettings({
                            ...settings,
                            display: { ...settings.display, theme }
                          })
                        }
                      >
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {['blue', 'green', 'purple', 'red', 'teal'].map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={settings.display.primaryColor === color ? 'default' : 'outline'}
                        className={`capitalize h-10 ${color === 'blue' ? 'bg-blue-600' : ''} ${color === 'green' ? 'bg-green-600' : ''} ${color === 'purple' ? 'bg-purple-600' : ''} ${color === 'red' ? 'bg-red-600' : ''} ${color === 'teal' ? 'bg-teal-600' : ''}`}
                        onClick={() => 
                          setSettings({
                            ...settings,
                            display: { ...settings.display, primaryColor: color }
                          })
                        }
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-tour">Show Guided Tour</Label>
                    <Switch
                      id="show-tour"
                      checked={settings.display.showTour}
                      onCheckedChange={(checked) => 
                        setSettings({
                          ...settings,
                          display: { ...settings.display, showTour: checked }
                        })
                      }
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Show a guided tour for new admin users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <ContentEditor
              section="homepage_banner"
              title="Homepage Banner"
              adminUsername={adminUsername}
              description="Edit the content of the homepage banner"
            />
            
            <ContentEditor
              section="site_settings"
              title="Site Settings"
              adminUsername={adminUsername}
              description="Edit global site settings in JSON format"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
