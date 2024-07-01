/**
 * Related to Svelte AST node {@link Css.Block}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Block} as string.
 */
export const print_css_block = define_printer((node: Css.Block, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Block", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.Block>(code, "Block");
			expect(print_css_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
