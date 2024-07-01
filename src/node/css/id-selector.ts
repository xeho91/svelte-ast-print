/**
 * Related to Svelte AST node {@link Css.IdSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.IdSelector} as string.
 */
export const print_css_id_selector = define_printer((node: Css.IdSelector, options) => {
	return "";
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
			`;
			const node = parse_and_extract_svelte_node<Css.IdSelector>(code, "IdSelector");
			expect(print_css_id_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
