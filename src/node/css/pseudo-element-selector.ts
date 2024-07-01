/**
 * Related to Svelte AST node {@link Css.PseudoElementSelector}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.PseudoElementSelector} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements}
 *
 * WARN: It doesn't support args, e.g. `::part()` or  `::slotted()`
 */
export const print_css_pseudo_element_selector = define_printer((node: Css.PseudoElementSelector, _options) => {
	const { name } = node;

	return insert("::", name);
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
				<style>
					p::before {
						content: "NOTE: ";
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.PseudoElementSelector>(code, "PseudoElementSelector");
			expect(print_css_pseudo_element_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"::before"`);
		});
	});
}
