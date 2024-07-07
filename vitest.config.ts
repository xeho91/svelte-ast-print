/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

/** @see {@link https://vitejs.dev/} */
export default defineConfig({
	resolve: {
		conditions: ["development"],
	},
	test: {
		coverage: {
			include: ["src/"],
		},
		include: ["tests/**/*.test.ts"],
	},
});
