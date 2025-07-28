import type { MasterLayoutPluginConfig } from "./MasterLayoutPlugin";

/**
 * Plugin registry interface
 */
export interface PluginRegistry {
  [key: string]: {
    name: string;
    version: string;
    description: string;
    author: string;
    dependencies: string[];
    config?: any;
  };
}

/**
 * Plugin manager for the application
 */
export class PluginManager {
  private plugins: PluginRegistry = {};

  /**
   * Register a plugin
   */
  register(
    name: string,
    plugin: {
      name: string;
      version: string;
      description: string;
      author: string;
      dependencies: string[];
      config?: any;
    }
  ): void {
    this.plugins[name] = plugin;
    console.log(`Plugin registered: ${name} v${plugin.version}`);
  }

  /**
   * Get a plugin by name
   */
  get(name: string) {
    return this.plugins[name];
  }

  /**
   * Get all registered plugins
   */
  getAll(): PluginRegistry {
    return { ...this.plugins };
  }

  /**
   * Check if a plugin is registered
   */
  has(name: string): boolean {
    return name in this.plugins;
  }

  /**
   * Get plugin configuration
   */
  getConfig(name: string): any {
    return this.plugins[name]?.config;
  }

  /**
   * Update plugin configuration
   */
  updateConfig(name: string, config: any): void {
    if (this.plugins[name]) {
      this.plugins[name].config = { ...this.plugins[name].config, ...config };
    }
  }
}

// Create global plugin manager instance
export const pluginManager = new PluginManager();

// Export plugin types
export type { MasterLayoutPluginConfig } from "./MasterLayoutPlugin";

// Export all plugins
export * from "./MasterLayoutPlugin";
