/**
 * Related to Svelte AST node {@link Css.Combinator}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Combinator} as string.
 */
export const print_css_combinator = define_printer((node: Css.Combinator, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Combinator", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.Combinator>(code, "Combinator");
			expect(print_css_combinator(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
