/**
 * Related to Svelte AST node {@link Css.ComplexSelector}.
 * @module
 */

import { print_css_relative_selector } from "#node/css/relative-selector";
import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.ComplexSelector} as string.
 */
export const print_css_complex_selector = define_printer((node: Css.ComplexSelector, options) => {
	const { children } = node;

	return children
		.map((relative_selector) => {
			return print_css_relative_selector(relative_selector, options);
		})
		.join("");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.ComplexSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					p {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.ComplexSelector>(code, "ComplexSelector");
			expect(print_css_complex_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"p"`);
		});
	});
}
