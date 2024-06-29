import type { Root } from "svelte/compiler";

import { type PrintOptions, transform_options } from "#options";
import { print_css } from "#root/css";
import { print_html as print_fragment } from "#root/html";
import { print_instance } from "#root/instance";
import { print_module } from "#root/module";
import { NEW_LINE } from "#util";

const DEFAULT_OPTIONS = {
	indent: "tab",
	order: ["module", "instance", "fragment", "css"],
} as const satisfies PrintOptions;

/**
 * @param ast - Svelte AST from {@link parse}
 * @returns Stringified Svelte AST.
 *
 * @example Using `parse` from "svelte/compiler"
 * ```ts
 * import fs from "node:fs";
 *
 * import { parse } from "svelte/compiler";
 * import { print } from "svelte-ast-print";
 *
 * const originalCode = fs.readFileSync("./Button.svelte", "utf8");
 * let parsed = parse(originalCode, { modernAst: true });
 * // ... do some modificiations with parsed Svelte AST
 * const modifiedCode = print(parsed); // stringified modified Svelte code
 * ```
 */
export function print(root: Root, options: Partial<PrintOptions>): string {
	const { css, fragment, instance, module } = root;
	const transformed_options = transform_options({ ...DEFAULT_OPTIONS, ...options });
	const { order } = transformed_options;
	const unduplicated_order = [...new Set(order)];

	return unduplicated_order
		.map((type) => {
			// biome-ignore format: Prettier
			switch (type) {
				case "css": return print_css(css, transformed_options);
				case "fragment": return print_fragment(fragment, transformed_options);
				case "instance": return print_instance(instance, transformed_options);
				case "module": return print_module(module, transformed_options);
				default: {
					// TODO: Improve message
					throw new TypeError(`Unrecognized type ${type} in order`);
				}
			}
		})
		.join(NEW_LINE);
}
