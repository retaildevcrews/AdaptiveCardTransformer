/* eslint-disable @typescript-eslint/no-explicit-any */

import debug from "debug"
import * as pluginPackage from "live-plugin-manager"
import * as path from "path"
import * as appRoot from "app-root-path"

const log = debug("adapter:pluginLoader")

// Plugins must be loaded into a single pluginManager for the adapter
const pluginManager = new pluginPackage.PluginManager()

/**
 * Load and initialize a plugin given installation and package information (defined by the pluginConfig)
 *
 * @param installPath Relative path from the root of the project to the plugin location
 * @param packageName Package name specified in the package.json
 * @param forceReinstall Flag to indicate if plugin should be reinstalled if already loaded
 * @returns Plugin function which can be invoked once loaded
 */
export async function loadPlugin(
	installPath: string,
	packageName: string,
	forceReinstall: boolean,
): Promise<any> {
	log("Loading in plugin: " + packageName + " from path: " + installPath)

	// Construct full plugin install path from project root and relative path
	const location = path.join(appRoot.toString(), installPath)

	await pluginManager.installFromPath(location, {
		force: forceReinstall,
	})
	return pluginManager.require(packageName)
}
