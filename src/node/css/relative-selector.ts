/**
 * Related to Svelte AST node {@link Css.RelativeSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.RelativeSelector} as string.
 */
export const print_css_relative_selector = define_printer((node: Css.RelativeSelector, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.RelativeSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.RelativeSelector>(code, "RelativeSelector");
			expect(print_css_relative_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
