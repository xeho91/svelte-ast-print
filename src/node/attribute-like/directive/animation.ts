/**
 * Related to Svelte AST {@link AnimateDirective} node.
 * @module
 */

import { print } from "esrap";
import { define_printer } from "#printer";
import type { AnimateDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link AnimateDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#animate-fn}
 *
 * @example without params
 * ```svelte
 * animate:name
 * ```
 *
 * @example with params
 * ```svelte
 * animate:name={params}
 * ```
 */
export const print_animate_directive = define_printer((node: AnimateDirective, _options) => {
	const { name, expression } = node;

	return insert(
		//
		"animate",
		":",
		name,
		expression && insert("={", print(expression).code, "}"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("AnimateDirective", () => {
		it("works on without params variant", ({ expect }) => {
			const code = `
				{#each list as item, index (item)}
					<li animate:flip>{item}</li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<AnimateDirective>(code, "AnimateDirective");
			expect(print_animate_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"animate:flip"`);
		});

		it("works on with params variant", ({ expect }) => {
			const code = `
				{#each list as item, index (item)}
					<li animate:flip={{ delay: 500 }}>{item}</li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<AnimateDirective>(code, "AnimateDirective");
			expect(print_animate_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"animate:flip={{ delay: 500 }}"`,
			);
		});
	});
}
