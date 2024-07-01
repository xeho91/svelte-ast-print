/// <reference types="vitest" />

import { defineConfig } from "vite";

/** @see {@link https://vitejs.dev/} */
const config = defineConfig({
	build: {
		lib: {
			entry: "src/mod.ts",
			formats: ["es"],
		},
		minify: true,
		sourcemap: true,
		target: "esnext",
	},
	define: {
		"import.meta.vitest": "undefined",
	},
	test: {
		include: ["src/**/*.test.ts"],
		includeSource: ["src/**/*.ts"],
		typecheck: {
			enabled: true,
		},
	},
});

export default config;
