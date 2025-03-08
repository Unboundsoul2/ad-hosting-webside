
/**
 * ConfigService - Manages application configuration and environment settings
 * Allows for seamless migration across different platforms and environments
 */
import { AppConfig } from "./config/types";
import { platformDetectionService } from "./platform/PlatformDetectionService";
import { configPersistenceService } from "./config/ConfigPersistenceService";

class ConfigService {
  private config: AppConfig;
  private static instance: ConfigService;

  private constructor() {
    // Default configuration values
    this.config = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || window.location.origin,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      environment: (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development',
      platformInfo: platformDetectionService.detectPlatform(),
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      buildTimestamp: import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString(),
    };

    // Log configuration on initialization
    console.log('ConfigService initialized', { 
      environment: this.config.environment,
      platform: this.config.platformInfo.type,
      version: this.config.version 
    });
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public async saveConfigState(): Promise<void> {
    await configPersistenceService.saveConfigState(this.config);
    // Update last migration timestamp in local config if save was successful
    const loadResult = await this.loadConfigState();
    if (loadResult && loadResult.config && loadResult.config.lastMigration) {
      this.config.lastMigration = loadResult.config.lastMigration;
    }
  }

  public async loadConfigState(): Promise<{ success: boolean, config?: AppConfig }> {
    const loadedConfig = await configPersistenceService.loadConfigState(this.config);
    if (loadedConfig) {
      this.config = loadedConfig;
      return { success: true, config: loadedConfig };
    }
    return { success: false };
  }
}

export const configService = ConfigService.getInstance();
export type { AppConfig } from "./config/types";
export type { PlatformInfo } from "./config/types";
