/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

/** @see {@link https://vitejs.dev/} */
export default defineConfig({
	resolve: {
		conditions: ["development"],
	},
	test: {
		include: ["tests/**/*.test.ts"],
	},
});
