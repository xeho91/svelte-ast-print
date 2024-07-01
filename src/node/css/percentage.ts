/**
 * Related to Svelte AST node {@link Css.Percentage}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Percentage} as string.
 */
export const print_css_percentage = define_printer((node: Css.Percentage, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Percentage", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.Percentage>(code, "Percentage");
			expect(print_css_percentage(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
