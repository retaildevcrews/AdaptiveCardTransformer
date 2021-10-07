/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import debug from "debug"
import * as templateTransformer from "./templateTransformer"
import { loadPlugin } from "./pluginLoader"

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

// Configure debug logger namespace
const log = debug("adapter:main")
const logError = debug("adapter:error")

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
		log("Starting template selection...")
		adaptiveCardTemplate = await templateSelector(dialogPayload)
		log("Template selection done...")
	} catch (error: any) {
		logError("Template Selector Plugin " + error.toString())
		throw new Error("Adapter " + error.toString())
	}

	// load and run preProcessor
	// check if plugin is specified, as preProcessor is optional
	if (config.preProcessorInstallPath && config.preProcessorPackageName) {
		const preProcess = await loadPlugin(
			config.preProcessorInstallPath,
			config.preProcessorPackageName,
			forceReinstall,
		)
		log("Starting preprocessing...")
		dialogPayload = preProcess(dialogPayload, adaptiveCardTemplate)
		log("Preprocessing done...")
	} else {
		log("No preprocessor loaded...")
	}

	// populate template with payload data
	log("Starting template transformation...")
	let adaptiveCardResponse = templateTransformer.process(
		dialogPayload,
		adaptiveCardTemplate,
	)
	log("Template transformation done...")

	// load and run postProcessor
	// check if plugin is specified, as postProcessor is optional
	if (config.postProcessorInstallPath && config.postProcessorPackageName) {
		const postProcess = await loadPlugin(
			config.postProcessorInstallPath,
			config.postProcessorPackageName,
			forceReinstall,
		)
		log("Starting postprocessing...")
		adaptiveCardResponse = postProcess(
			dialogPayload,
			adaptiveCardTemplate,
			adaptiveCardResponse,
		)
		log("Postprocessing done...")
	}

	return adaptiveCardResponse
}
