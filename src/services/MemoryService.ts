
/**
 * MemoryService - Tracks user activity and project state across platforms
 * Enables seamless continuation of work across different environments
 */
import { supabase } from "@/integrations/supabase/client";
import { configService } from "./ConfigService";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

// Define types for our custom tables
interface UserActivityLog {
  user_id: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
  route?: string;
}

interface UserProjectState {
  user_id: string;
  state: any;
  last_updated: string;
  platform_info: any;
  imported_from?: string;
}

class MemoryService {
  private activityQueue: Array<{
    userId: string;
    action: string;
    timestamp: string;
    metadata?: Record<string, any>;
    route?: string;
  }> = [];
  private isProcessingQueue = false;
  private static instance: MemoryService;
  
  private constructor() {
    // Initialize the service
    console.log('MemoryService initialized');
    
    // Set up activity tracking
    this.setupActivityTracking();
    
    // Process queue periodically
    setInterval(() => this.processActivityQueue(), 30000);
  }
  
  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }
  
  /**
   * Tracks user activity for continuity across platforms
   */
  public async trackActivity(action: string, metadata?: Record<string, any>): Promise<void> {
    try {
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;
      const userId = session?.user?.id;
      
      if (!userId) {
        // Store locally if not authenticated
        const localActivities = JSON.parse(localStorage.getItem('activity_log') || '[]');
        localActivities.push({
          action,
          timestamp: new Date().toISOString(),
          metadata,
          platform: configService.getConfig().platformInfo.type
        });
        localStorage.setItem('activity_log', JSON.stringify(localActivities.slice(-50)));
        return;
      }
      
      // Get current route if in browser environment
      let route = undefined;
      if (typeof window !== 'undefined') {
        route = window.location.pathname;
      }
      
      // Queue the activity for batch processing
      this.activityQueue.push({
        userId,
        action,
        timestamp: new Date().toISOString(),
        metadata,
        route
      });
      
      // Process immediately if queue is getting large
      if (this.activityQueue.length >= 10) {
        await this.processActivityQueue();
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }
  
  /**
   * Process queued activities in batch
   */
  private async processActivityQueue(): Promise<void> {
    if (this.isProcessingQueue || this.activityQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    try {
      const activitiesToProcess = [...this.activityQueue];
      this.activityQueue = [];
      
      const formattedActivities = activitiesToProcess.map(activity => ({
        user_id: activity.userId,
        action: activity.action,
        timestamp: activity.timestamp,
        metadata: activity.metadata || {} as Json,
        route: activity.route
      }));
      
      // Use type assertion for the query
      await supabase
        .from('user_activity_logs' as any)
        .insert(formattedActivities);
      
      console.log(`Processed ${activitiesToProcess.length} activities`);
    } catch (error) {
      console.error('Failed to process activity queue:', error);
      
      // Re-queue failed activities
      this.activityQueue = [
        ...this.activityQueue,
        ...this.activityQueue.splice(0, 10)
      ];
    } finally {
      this.isProcessingQueue = false;
    }
  }
  
  /**
   * Save current project state for continuity across platforms
   */
  public async saveProjectState(state: any): Promise<boolean> {
    try {
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;
      
      if (!session) {
        // Store locally if not authenticated
        localStorage.setItem('project_state', JSON.stringify(state));
        return true;
      }
      
      // Use type assertion for the query and ensure JSON compatibility
      await supabase
        .from('user_project_states' as any)
        .upsert({
          user_id: session.user.id,
          state: state as Json,
          last_updated: new Date().toISOString(),
          platform_info: configService.getConfig().platformInfo as unknown as Json,
          imported_from: 'direct_save'
        }, { onConflict: 'user_id' });
      
      return true;
    } catch (error) {
      console.error('Failed to save project state:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your project state.",
        variant: "destructive"
      });
      return false;
    }
  }
  
  /**
   * Load project state for continuation of work
   */
  public async loadProjectState(): Promise<any> {
    try {
      const sessionResponse = await supabase.auth.getSession();
      const session = sessionResponse.data.session;
      
      if (!session) {
        // Load from local storage if not authenticated
        const localState = localStorage.getItem('project_state');
        return localState ? JSON.parse(localState) : null;
      }
      
      // Use type assertion for the query
      const { data, error } = await supabase
        .from('user_project_states')
        .select('*')
        .eq('user_id', session.user.id)
        .single() as any;
        
      if (error || !data) {
        const localState = localStorage.getItem('project_state');
        return localState ? JSON.parse(localState) : null;
      }
      
      // Type assertion to safely access properties
      const projectState = data as unknown as UserProjectState;
      
      console.log('Project state loaded', {
        lastUpdated: projectState.last_updated,
        platform: projectState.platform_info?.type
      });
      
      return projectState.state;
    } catch (error) {
      console.error('Failed to load project state:', error);
      return null;
    }
  }
  
  /**
   * Prepares the state for migration to a new platform
   */
  public async migrateToNewPlatform(): Promise<void> {
    try {
      // Track this migration
      this.trackActivity('migration_prepared', {
        sourcePlatform: configService.getConfig().platformInfo.type,
        timestamp: new Date().toISOString()
      });
      
      // For any additional migration steps
      console.log('Project prepared for migration to new platform');
    } catch (error) {
      console.error('Failed to prepare for migration:', error);
    }
  }
  
  /**
   * Set up activity tracking hooks
   */
  private setupActivityTracking(): void {
    if (typeof window !== 'undefined') {
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.trackActivity('app_resumed');
        } else {
          this.trackActivity('app_backgrounded');
        }
      });
      
      // Track app/tab close
      window.addEventListener('beforeunload', () => {
        this.trackActivity('app_closed');
        this.processActivityQueue();
      });
    }
  }
}

export const memoryService = MemoryService.getInstance();
