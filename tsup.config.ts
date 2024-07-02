import { defineConfig } from "tsup";

/** @see {@link https://github.com/egoist/tsup} */
export default defineConfig({
	bundle: false,
	define: {
		"import.meta.vitest": "undefined",
	},
	entry: ["src/**/*.ts"],
	esbuildOptions: (options) => {
		options.conditions = ["development"];

		return options;
	},
	experimentalDts: true,
	format: ["esm"],
	minify: false,
	target: "esnext",
	splitting: false,
	treeshake: false,
});
