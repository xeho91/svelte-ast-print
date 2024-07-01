/**
 * Related to Svelte AST {@link UseDirective} node.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { UseDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link UseDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#use-action}
 *
 * @example UseDirective - without params
 * ```svelte
 * use:action
 * ```
 *
 * @example UseDirective - with parameters
 * ```svelte
 * use:action={parameters}
 * ```
 */
export const print_use_directive = define_printer((node: UseDirective, _options) => {
	const { expression, name } = node;

	return insert("use", ":", name, expression && insert("={", print(expression).code, "}"));
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("UseDirective", () => {
		it("works with parameters", ({ expect }) => {
			const code = `
				<div use:foo={bar} />
			`;
			const node = parse_and_extract_svelte_node<UseDirective>(code, "UseDirective");
			expect(print_use_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"use:foo={bar}"`);
		});

		it("works on without parameters - shorthand", ({ expect }) => {
			const code = `
				<div use:foo />
			`;
			const node = parse_and_extract_svelte_node<UseDirective>(code, "UseDirective");
			expect(print_use_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"use:foo"`);
		});
	});
}
