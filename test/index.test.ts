/* eslint-disable @typescript-eslint/no-explicit-any */

import adapter from "../src"
import { mocked } from "ts-jest/utils"
import { loadPlugin } from "../src/pluginLoader"
import { process as templateTransformer } from "../src/templateTransformer"
import * as optionButtons from "./testTemplates/optionButtons"

jest.mock("../src/pluginLoader")

describe("adapter tests", () => {
	// Test the plugin call order and data pipeline within the adapter
	test("order and functionality of adapter", async () => {
		// Create mocks and setup test
		const mockLoadPlugin = mocked(loadPlugin, true)

		mockLoadPlugin
			// Mock selector plugin to return a template
			.mockReturnValueOnce(Promise.resolve(() => optionButtons.template))
			// Mock pre-processor plugin to return a payload
			.mockReturnValueOnce(Promise.resolve(() => optionButtons.apiPayload))
			// Mock post-processor plugin to manipulate the transformed adaptive card tempalte
			.mockReturnValue(
				Promise.resolve(
					(
						_dialogPayload: any,
						_adaptiveCardTemplate: any,
						adaptiveCardResponse: any,
					) => {
						const obj = { ...adaptiveCardResponse }
						obj.body[0].size = "Large"
						return obj
					},
				),
			)

		// Invoke adapter
		const completedAdaptiveCard = await adapter(
			{},
			{
				templateSelectorInstallPath: "selector/path",
				templateSelectorPackageName: "selector",
				preProcessorInstallPath: "preprocessor/path",
				preProcessorPackageName: "pre",
				postProcessorInstallPath: "postprocessor/path",
				postProcessorPackageName: "post",
			},
		)

		// Assert
		expect(mockLoadPlugin).toHaveBeenCalledTimes(3)
		expect(completedAdaptiveCard).toEqual(optionButtons.expectedResponseAltered)
	})

	// Test that the template transformer correctly applies the data into the adaptive card template
	test("template transformer", () => {
		// Invoke templateTransformer given test payloads
		const response = templateTransformer(
			optionButtons.apiPayload,
			optionButtons.template,
		)

		// Assert we get the right response
		expect(response).toEqual(optionButtons.expectedResponse)
	})
})
