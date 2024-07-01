/**
 * Related to Svelte AST node {@link Css.Declaration}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Declaration} as string.
 */
export const print_css_declaration = define_printer((node: Css.Declaration, options) => {
	return "";
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
			`;
			const node = parse_and_extract_svelte_node<Css.Declaration>(code, "Declaration");
			expect(print_css_declaration(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
