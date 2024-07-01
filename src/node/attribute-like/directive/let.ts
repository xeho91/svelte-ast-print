/**
 * Related to Svelte AST {@link LetDirective} node.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { LetDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link LetDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#slot-slot-key-value}
 *
 * @example with value
 * ```svelte
 * let:item={item}
 * ```
 *
 * @example without value
 * ```svelte
 * let:item={item}
 * ```
 */
export const print_let_directive = define_printer((node: LetDirective, _options) => {
	const { expression, name } = node;

	return insert(
		//
		"let",
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

	describe("LetDirective", () => {
		it("works on with value", ({ expect }) => {
			const code = `
				<FancyList {items} let:prop={thing}>
					<div>{thing.text}</div>
				</FancyList>
			`;
			const node = parse_and_extract_svelte_node<LetDirective>(code, "LetDirective");
			expect(print_let_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"let:prop={thing}"`);
		});

		it("works on without value", ({ expect }) => {
			const code = `
				<Story let:args>
					<Button {...args} />
				</Story>
			`;
			const node = parse_and_extract_svelte_node<LetDirective>(code, "LetDirective");
			expect(print_let_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"let:args"`);
		});
	});
}
