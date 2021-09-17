/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import * as templateTransformer from "./templateTransformer"
import { loadPlugin } from "./pluginLoader"
import Logger from "./logger"

/**
 * @interface PluginConfig Represents a plugin config for the adapter
 *
 * Config provides an install path and package name for each plugin.
 * As defined in the PluginConfig, the adapter installs the plugins in this order: templateSeletor, preProcessor, and postProcessor.
 */
interface PluginConfig {
	readonly templateSelectorPackageName: string
	readonly templateSelectorInstallPath: string
	readonly forceReinstall?: boolean
	readonly preProcessorPackageName?: string
	readonly preProcessorInstallPath?: string
	readonly postProcessorPackageName?: string
	readonly postProcessorInstallPath?: string
}

/**
 * Populate an Adpative Card given a set of defined plugins.
 * The plugins will be consumed by the adapter to select the correct card template
 * and provide pre and post hooks to manipulate the data.
 *
 * @param dialogPayload Data payload which will be used to transform the adaptive card
 * @param config Configuration file that defined the plugin information to be utilized
 * @returns Transformed and populated Adaptive Card JSON
 */
export default async function adapter(
	dialogPayload: any,
	config: PluginConfig,
): Promise<any> {
	const forceReinstall = config.forceReinstall || false

	// load and run template selector
	const templateSelector = await loadPlugin(
		config.templateSelectorInstallPath,
		config.templateSelectorPackageName,
		forceReinstall,
	)

	let adaptiveCardTemplate = null
	try {
		adaptiveCardTemplate = await templateSelector(dialogPayload)
	} catch (error: any) {
		Logger.error("Template Selector Plugin " + error.toString())
		throw new Error("Adapter " + error.toString())
	}

	// load and run preProcessor
	// check if plugin is specified as preProcessor is optional
	if (config.preProcessorInstallPath && config.preProcessorPackageName) {
		const preProcess = await loadPlugin(
			config.preProcessorInstallPath,
			config.preProcessorPackageName,
			forceReinstall,
		)
		dialogPayload = preProcess(dialogPayload, adaptiveCardTemplate)
	}

	// populate template with payload data
	let adaptiveCardResponse = templateTransformer.process(
		dialogPayload,
		adaptiveCardTemplate,
	)

	// load and run postProcessor
	// check if plugin is specified as postProcessor is optional
	if (config.postProcessorInstallPath && config.postProcessorPackageName) {
		const postProcess = await loadPlugin(
			config.postProcessorInstallPath,
			config.postProcessorPackageName,
			forceReinstall,
		)
		adaptiveCardResponse = postProcess(
			dialogPayload,
			adaptiveCardTemplate,
			adaptiveCardResponse,
		)
	}

	return adaptiveCardResponse
}
