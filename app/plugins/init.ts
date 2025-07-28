import { pluginManager } from "./index";
import { PLUGIN_CONFIG, DEFAULT_PLUGIN_CONFIG } from "./MasterLayoutPlugin";

/**
 * Initialize all plugins
 */
export const initializePlugins = () => {
  // Register MasterLayout Plugin
  pluginManager.register("MasterLayoutPlugin", {
    ...PLUGIN_CONFIG,
    config: DEFAULT_PLUGIN_CONFIG,
  });

  console.log("All plugins initialized successfully");
};

/**
 * Get plugin configuration
 */
export const getPluginConfig = (pluginName: string) => {
  return pluginManager.getConfig(pluginName);
};

/**
 * Update plugin configuration
 */
export const updatePluginConfig = (pluginName: string, config: any) => {
  pluginManager.updateConfig(pluginName, config);
};

/**
 * Get all registered plugins
 */
export const getRegisteredPlugins = () => {
  return pluginManager.getAll();
};
