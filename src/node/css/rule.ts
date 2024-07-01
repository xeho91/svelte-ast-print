/**
 * Related to Svelte AST node {@link Css.Rule}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Rule} as string.
 */
export const print_css_rule = define_printer((node: Css.Rule, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Rule", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.Rule>(code, "Rule");
			expect(print_css_rule(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
