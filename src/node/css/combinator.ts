/**
 * Related to Svelte AST node {@link Css.Combinator}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Combinator} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
 */
export const print_css_combinator = define_printer((node: Css.Combinator, _options) => {
	return node.name;
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
				<style>
					p + .color {}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Combinator>(code, "Combinator");
			expect(print_css_combinator(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"+"`);
		});
	});
}
