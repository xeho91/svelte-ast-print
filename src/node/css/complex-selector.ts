/**
 * Related to Svelte AST node {@link Css.ComplexSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.ComplexSelector} as string.
 */
export const print_css_complex_selector = define_printer((node: Css.ComplexSelector, options) => {
	return "";
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
			`;
			const node = parse_and_extract_svelte_node<Css.ComplexSelector>(code, "ComplexSelector");
			expect(print_css_complex_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
