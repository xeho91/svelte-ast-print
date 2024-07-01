/**
 * Related to Svelte AST node {@link Css.Nth}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.Nth} as string.
 */
export const print_css_nth = define_printer((node: Css.Nth, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Nth", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			`;
			const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
			expect(print_css_nth(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot("");
		});
	});
}
