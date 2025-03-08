
/**
 * ConfigPersistenceService - Manages saving and loading configuration to/from Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Tables } from "@/integrations/supabase/schema";
import { AppConfig, UserConfigState } from "./types";

export class ConfigPersistenceService {
  /**
   * Saves the current configuration to Supabase
   */
  public async saveConfigState(config: AppConfig): Promise<void> {
    try {
      // Only attempt to save if we have an authenticated user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const timestamp = new Date().toISOString();
      
      // Try direct table insert/update instead of RPC
      const query = supabase.from(Tables.USER_CONFIG_STATES);
      const { error } = await query.upsert({
        user_id: session.user.id,
        config: config as unknown as Json,
        last_updated: timestamp
      }, { onConflict: 'user_id' });

      if (error) {
        console.error('Failed to save configuration using upsert:', error);
      } else {
        console.log('Configuration state saved');
      }
    } catch (error) {
      console.error('Failed to save configuration state:', error);
    }
  }

  /**
   * Loads configuration from Supabase
   */
  public async loadConfigState(currentConfig: AppConfig): Promise<AppConfig | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // Use the Tables constant for the table name
      const query = supabase.from(Tables.USER_CONFIG_STATES);
      const { data, error } = await query
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !data) return null;

      // Type assertions to access properties safely
      const configState = data as unknown as UserConfigState;
      
      // Merge saved configuration with defaults
      const mergedConfig = {
        ...currentConfig,
        ...configState.config,
        lastMigration: configState.last_updated
      };
      
      console.log('Configuration state loaded', { lastMigration: configState.last_updated });
      return mergedConfig;
    } catch (error) {
      console.error('Failed to load configuration state:', error);
      return null;
    }
  }
}

export const configPersistenceService = new ConfigPersistenceService();
