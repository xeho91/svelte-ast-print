import { defineConfig } from "vitest/config";

/** @see {@link https://vitest.dev/} */
const config = defineConfig({
	test: {
		include: ["src/**/*.test.ts"],
		includeSource: ["src/**/*.ts"],
		typecheck: {
			enabled: true,
		},
	},
});

export default config;
