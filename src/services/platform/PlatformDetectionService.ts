
/**
 * PlatformDetectionService - Detects the current platform and available capabilities
 */
import { PlatformInfo } from "../config/types";

export class PlatformDetectionService {
  /**
   * Detects the current platform type and capabilities
   */
  public detectPlatform(): PlatformInfo {
    // Detect the platform type based on environment and available APIs
    const userAgent = navigator.userAgent.toLowerCase();
    const capabilities = [];
    
    if ('serviceWorker' in navigator) capabilities.push('service-worker');
    if (window.indexedDB) capabilities.push('indexed-db');
    if (navigator.storage && navigator.storage.persist) capabilities.push('persistent-storage');
    
    // Check for container environment (likely Docker)
    if (import.meta.env.VITE_CONTAINER_ENV === 'true') {
      return {
        type: 'container',
        details: { containerType: import.meta.env.VITE_CONTAINER_TYPE || 'unknown' },
        capabilities
      };
    }
    
    // Check for Electron (desktop)
    if (window.navigator.userAgent.indexOf('Electron') > -1) {
      return {
        type: 'desktop',
        details: { framework: 'electron' },
        capabilities: [...capabilities, 'file-system-access', 'native-api']
      };
    }
    
    // Check for mobile app wrappers (like Capacitor or Cordova)
    if (
      window.hasOwnProperty('cordova') || 
      userAgent.indexOf('android') > -1 || 
      userAgent.indexOf('iphone') > -1 || 
      userAgent.indexOf('ipad') > -1
    ) {
      return {
        type: 'mobile',
        details: { os: /android/.test(userAgent) ? 'android' : 'ios' },
        capabilities: [...capabilities, 'camera', 'geolocation', 'push-notifications']
      };
    }

    // Default to web
    return {
      type: 'web',
      details: { 
        browser: this.getBrowserInfo(),
        isSecure: window.location.protocol === 'https:'
      },
      capabilities
    };
  }

  /**
   * Gets information about the current browser
   */
  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf('Firefox') > -1) return 'firefox';
    if (userAgent.indexOf('Chrome') > -1) return 'chrome';
    if (userAgent.indexOf('Safari') > -1) return 'safari';
    if (userAgent.indexOf('Edge') > -1) return 'edge';
    return 'other';
  }
}

export const platformDetectionService = new PlatformDetectionService();
