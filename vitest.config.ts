/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

/** @see {@link https://vitejs.dev/} */
export default defineConfig({
	resolve: {
		conditions: ["development"],
	},
	test: {
		include: ["src/**/*.test.ts"],
		includeSource: ["src/**/*.ts"],
		typecheck: {
			enabled: true,
		},
	},
});
