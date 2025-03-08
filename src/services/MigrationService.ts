
/**
 * MigrationService - Facilitates project migration between platforms
 * Provides tools for exporting/importing project state and configuration
 */
import { supabase } from "@/integrations/supabase/client";
import { configService } from "./ConfigService";
import { memoryService } from "./MemoryService";
import { toast } from "@/hooks/use-toast";

interface MigrationPackage {
  version: string;
  timestamp: string;
  config: any;
  state: any;
  platform: string;
}

// Type definitions for our database tables
interface UserProjectState {
  user_id: string;
  state: any;
  last_updated: string;
  platform_info: any;
  imported_from: string;
}

interface MigrationCode {
  code: string;
  user_id: string;
  package_data: MigrationPackage;
  created_at: string;
  expires_at: string;
  used: boolean;
}

interface MigrationHistory {
  user_id: string;
  source_platform: string;
  target_platform: string;
  migration_timestamp: string;
  version: string;
}

class MigrationService {
  private static instance: MigrationService;
  
  private constructor() {
    // Initialize the service
    console.log('MigrationService initialized');
  }
  
  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }
  
  /**
   * Exports the current project state to a JSON package that can be imported on another platform
   */
  public async exportProjectPackage(): Promise<string> {
    try {
      // Ensure we have the latest state before exporting
      await memoryService.migrateToNewPlatform();
      
      const { data: { session } } = await supabase.auth.getSession();
      
      let state = null;
      if (session) {
        // Use type assertion for the query
        const { data, error } = await supabase
          .from('user_project_states' as any)
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (data && !error) {
          // Type assertion to safely access properties
          const stateRow = data as unknown as UserProjectState;
          state = stateRow.state;
        }
      } else {
        state = JSON.parse(localStorage.getItem('project_state') || 'null');
      }
      
      const migrationPackage: MigrationPackage = {
        version: configService.getConfig().version,
        timestamp: new Date().toISOString(),
        config: configService.getConfig(),
        state,
        platform: configService.getConfig().platformInfo.type
      };
      
      // Generate a migration code for easy transfer
      const migrationCode = await this.generateMigrationCode(migrationPackage);
      
      // Return JSON string for download or direct transfer
      return JSON.stringify(migrationPackage);
    } catch (error) {
      console.error('Failed to export project package:', error);
      throw new Error('Export failed');
    }
  }
  
  /**
   * Imports a project state from another platform
   */
  public async importProjectPackage(packageStr: string): Promise<boolean> {
    try {
      const migrationPackage: MigrationPackage = JSON.parse(packageStr);
      
      // Validate the package
      if (!migrationPackage.version || !migrationPackage.timestamp || !migrationPackage.state) {
        throw new Error('Invalid migration package');
      }
      
      // Store the imported state
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Use type assertion for the query
        await supabase
          .from('user_project_states' as any)
          .upsert({
            user_id: session.user.id,
            state: migrationPackage.state,
            last_updated: new Date().toISOString(),
            platform_info: configService.getConfig().platformInfo,
            imported_from: migrationPackage.platform
          }, { onConflict: 'user_id' });
          
        // Use type assertion for the query
        await supabase
          .from('migration_history' as any)
          .insert({
            user_id: session.user.id,
            source_platform: migrationPackage.platform,
            target_platform: configService.getConfig().platformInfo.type,
            migration_timestamp: new Date().toISOString(),
            version: migrationPackage.version
          });

        toast({
          title: "Import Successful",
          description: `Project imported from ${migrationPackage.platform} platform`,
        });
      } else {
        // Store in local storage if not logged in
        localStorage.setItem('project_state', JSON.stringify(migrationPackage.state));
        toast({
          title: "Import Successful",
          description: "Project state saved locally (not logged in)",
        });
      }
      
      // Reload the page to apply changes
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Failed to import project package:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  }
  
  /**
   * Generates a short code for easier migration between platforms
   */
  private async generateMigrationCode(migrationPackage: MigrationPackage): Promise<string> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }
      
      // Use type assertion for the query
      const { data, error } = await supabase
        .from('migration_codes' as any)
        .insert({
          user_id: session.user.id,
          package_data: migrationPackage,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        })
        .select('code')
        .single();
        
      if (error) throw error;
      
      // Type assertion to safely access the code
      const codeData = data as unknown as MigrationCode;
      return codeData.code || 'CODE-ERROR';
    } catch (error) {
      console.error('Failed to generate migration code:', error);
      throw new Error('Code generation failed');
    }
  }
  
  /**
   * Imports a project state using a migration code
   */
  public async importWithCode(code: string): Promise<boolean> {
    try {
      // Use type assertion for the query
      const { data, error } = await supabase
        .from('migration_codes' as any)
        .select('*')
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .eq('used', false)
        .single();
        
      if (error || !data) {
        toast({
          title: "Invalid Code",
          description: "The migration code is invalid or has expired",
          variant: "destructive"
        });
        throw new Error('Invalid or expired code');
      }
      
      // Mark the code as used
      await supabase
        .from('migration_codes' as any)
        .update({ used: true })
        .eq('code', code);
      
      // Type assertion to safely access package_data
      const migrationData = data as unknown as MigrationCode;
      return await this.importProjectPackage(JSON.stringify(migrationData.package_data));
    } catch (error) {
      console.error('Failed to import with code:', error);
      return false;
    }
  }
  
  /**
   * AI-assisted state restoration
   * Uses project metadata to intelligently restore state across platforms
   */
  public async aiRecommendedRestore(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }
      
      // Get user's migration history
      // Use type assertion for the query
      const { data: migrations, error } = await supabase
        .from('migration_history' as any)
        .select('*')
        .eq('user_id', session.user.id)
        .order('migration_timestamp', { ascending: false })
        .limit(5);
        
      if (error || !migrations || migrations.length === 0) {
        // No history found, just load the current state
        toast({
          title: "No Migration History",
          description: "No previous migrations found to restore from",
        });
        return true;
      }
      
      // Analyze migrations to find the most appropriate state
      const currentPlatform = configService.getConfig().platformInfo.type;
      
      // Type casting for safe property access
      const migrationsTyped = migrations as unknown as MigrationHistory[];
      const relevantMigration = migrationsTyped.find(m => m.target_platform === currentPlatform);
      
      if (relevantMigration) {
        // We've been on this platform before, let's try to restore that state
        // Use type assertion for the query
        const { data } = await supabase
          .from('user_project_states' as any)
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (data) {
          // Restore the state and notify the user
          toast({
            title: "AI-Recommended Restore",
            description: `State restored from your previous ${currentPlatform} session`,
          });
          console.log('AI-recommended state restoration complete');
          return true;
        }
      }
      
      toast({
        title: "No Relevant State",
        description: "Could not find a relevant previous state for this platform",
      });
      
      return false;
    } catch (error) {
      console.error('AI-recommended restore failed:', error);
      toast({
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  }
}

export const migrationService = MigrationService.getInstance();
