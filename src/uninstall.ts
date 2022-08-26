import { ConfigManager } from './configuration/configManager';
import { FSNode } from './fs/fsNode';

// TODO: (ROB) this will just work for node. Create an uninstall endpoint for the web
void ConfigManager.removeSettings(new FSNode());
