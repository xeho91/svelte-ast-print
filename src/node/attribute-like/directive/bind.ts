/**
 * Related to Svelte AST {@link BindDirective} node.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { BindDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link BindDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#bind-property}
 *
 * @example pattern
 * ```svelte
 * bind:property={variable}
 * ```
 */
export const print_bind_directive = define_printer((node: BindDirective, _options) => {
	const { name, expression } = node;

	return insert(
		//
		"bind",
		":",
		name,
		insert("={", print(expression).code, "}"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("BindDIrective", () => {
		it("works on binding input value", ({ expect }) => {
			const code = `
				<input bind:value={name} />
			`;
			const node = parse_and_extract_svelte_node<BindDirective>(code, "BindDirective");
			expect(print_bind_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"bind:value={name}"`);
		});

		it("works on binding input checked", ({ expect }) => {
			const code = `
				<input type="checkbox" bind:checked={yes} />
			`;
			const node = parse_and_extract_svelte_node<BindDirective>(code, "BindDirective");
			expect(print_bind_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"bind:checked={yes}"`);
		});
	});
}
