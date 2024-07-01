/**
 * Related to Svelte AST node {@link Css.Rule}.
 * @module
 */

import { print_css_block } from "#node/css/block";
import { print_css_selector_list } from "#node/css/selector-list";
import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.Rule} as string.
 */
export const print_css_rule = define_printer((node: Css.Rule, options) => {
	const { block, prelude } = node;

	return insert(
		//
		print_css_selector_list(prelude, options),
		insert(" ", print_css_block(block, options)),
	);
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
				<style>
					p {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Rule>(code, "Rule");
			expect(print_css_rule(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"p {
					color: red;
				}
				"
			`);
		});
	});
}
