/**
 * Related to Svelte AST node {@link Css.PseudoElementSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.PseudoElementSelector} as string.
 */
export const print_css_pseudo_element_selector = define_printer((node: Css.PseudoElementSelector, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.PseudoElementSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.PseudoElementSelector>(code, "PseudoElementSelector");
			expect(print_css_pseudo_element_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
