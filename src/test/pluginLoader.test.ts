import { loadPlugin } from "../adapter/pluginLoader"

describe("plugin loader test", () => {
	// Test loadPlugin can load a plugin given an install path and packageName
	test("loadPlugin", async () => {
		const installPath = "src/test/examplePlugin"
		const packageName = "example-plugin"
		const data = 5

		// Invoke loadPlugin given test payloads
		const pluginFunction = await loadPlugin(installPath, packageName, false)

		// Assert packages are loaded into memory and invoke
		const response = pluginFunction(data)
		expect(response).toEqual({ value: 6 })
	})
})
