/**
 * Related to Svelte AST node {@link Css.TypeSelector}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.TypeSelector} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors}
 */
export const print_css_type_selector = define_printer((node: Css.TypeSelector, _options) => {
	return node.name;
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.TypeSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					p {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.TypeSelector>(code, "TypeSelector");
			expect(print_css_type_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"p"`);
		});
	});
}
