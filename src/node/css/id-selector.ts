/**
 * Related to Svelte AST node {@link Css.IdSelector}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.IdSelector} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors}
 *
 * @example pattern
 * ```css
 * #name
 * ```
 */
export const print_css_id_selector = define_printer((node: Css.IdSelector, _options) => {
	return insert("#", node.name);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.IdSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					#app {
						max-width: 100lvh;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.IdSelector>(code, "IdSelector");
			expect(print_css_id_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"#app"`);
		});
	});
}
