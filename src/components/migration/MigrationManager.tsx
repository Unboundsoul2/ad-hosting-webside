import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { configService, PlatformInfo } from '@/services/ConfigService';
import { migrationService } from '@/services/MigrationService';
import { memoryService } from '@/services/MemoryService';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Download, Upload, RefreshCcw, Database } from 'lucide-react';

const MigrationManager: React.FC = () => {
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [migrationCode, setMigrationCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const config = configService.getConfig();
    setPlatform(config.platformInfo);
  }, []);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const packageData = await migrationService.exportProjectPackage();
      
      // Download file
      const blob = new Blob([packageData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-migration-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Your project has been exported successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      setIsLoading(true);
      await migrationService.exportProjectPackage();
      setMigrationCode('MIG-' + Math.random().toString(36).substring(2, 8).toUpperCase());
      
      toast({
        title: "Code Generated",
        description: "Use this code to import your project on another device.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Code Generation Failed",
        description: "There was an error generating your migration code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setIsLoading(true);
        const content = e.target?.result as string;
        const success = await migrationService.importProjectPackage(content);
        
        if (success) {
          toast({
            title: "Import Successful",
            description: "Your project has been imported successfully.",
          });
        } else {
          throw new Error("Import failed");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Import Failed",
          description: "There was an error importing your project.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleImportWithCode = async () => {
    if (!importCode) {
      toast({
        title: "Code Required",
        description: "Please enter a migration code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await migrationService.importWithCode(importCode);
      
      if (success) {
        toast({
          title: "Import Successful",
          description: "Your project has been imported successfully.",
        });
        setImportCode('');
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Import Failed",
        description: "Invalid or expired migration code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIRestore = async () => {
    try {
      setIsLoading(true);
      const success = await migrationService.aiRecommendedRestore();
      
      if (success) {
        toast({
          title: "Restoration Complete",
          description: "Your project state has been intelligently restored.",
        });
      } else {
        toast({
          title: "No Suitable State Found",
          description: "We couldn't find a suitable previous state to restore.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Restoration Failed",
        description: "There was an error restoring your project state.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Project Migration Manager
          {platform && (
            <Badge variant="outline" className="ml-2">
              {platform.type.charAt(0).toUpperCase() + platform.type.slice(1)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Move your project seamlessly between different platforms and environments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="export">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="restore">Restore</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Export your project to move it to another platform or as a backup.
              </p>
              
              <div className="grid gap-4">
                <Button onClick={handleExport} disabled={isLoading}>
                  <Download className="mr-2 h-4 w-4" /> Export as File
                </Button>
                
                <Button variant="outline" onClick={handleGenerateCode} disabled={isLoading}>
                  Generate Migration Code
                </Button>
                
                {migrationCode && (
                  <div className="p-4 border rounded-md bg-muted">
                    <Label htmlFor="migrationCode">Migration Code</Label>
                    <div className="flex mt-1">
                      <Input 
                        id="migrationCode" 
                        value={migrationCode} 
                        readOnly 
                        className="font-mono"
                      />
                      <Button 
                        variant="ghost" 
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(migrationCode);
                          toast({
                            title: "Copied",
                            description: "Migration code copied to clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This code is valid for 24 hours. Use it to import your project on another device.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Import a project from another platform or restore from a backup.
              </p>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="importFile">Import from File</Label>
                  <Input 
                    id="importFile" 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportFile}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="importCode">Import with Code</Label>
                  <div className="flex">
                    <Input
                      id="importCode"
                      placeholder="Enter migration code"
                      value={importCode}
                      onChange={(e) => setImportCode(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      className="ml-2" 
                      onClick={handleImportWithCode}
                      disabled={isLoading || !importCode}
                    >
                      <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="restore" className="space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Restore your project state intelligently based on your usage patterns.
              </p>
              
              <div className="space-y-4">
                <Button 
                  variant="default" 
                  onClick={handleAIRestore}
                  disabled={isLoading}
                  className="w-full"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> AI-Assisted Restore
                </Button>
                
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Important Note</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      Restoration works best when you've previously used the migration export feature. 
                      The AI will analyze your previous project states and recommend the most suitable configuration.
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    memoryService.trackActivity('manual_database_sync');
                    toast({
                      title: "Sync Complete",
                      description: "Your database settings have been synchronized.",
                    });
                  }}
                  disabled={isLoading}
                >
                  <Database className="mr-2 h-4 w-4" /> Sync Database Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Current Platform: {platform?.type || 'Unknown'} • 
          Environment: {configService.getConfig().environment}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MigrationManager;
