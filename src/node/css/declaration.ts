/**
 * Related to Svelte AST node {@link Css.Declaration}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.Declaration} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
 */
export const print_css_declaration = define_printer((node: Css.Declaration, _options) => {
	const { property, value } = node;

	return insert(
		//
		property,
		": ",
		value,
		";",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Declaration", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					div {
						background-color: orange;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Declaration>(code, "Declaration");
			expect(print_css_declaration(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"background-color: orange;"`);
		});
	});
}
