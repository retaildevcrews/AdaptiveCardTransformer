/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
	preset: "ts-jest",
	rootDir: ".",
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
}
