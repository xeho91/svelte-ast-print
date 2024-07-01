/**
 * Related to Svelte AST node {@link Css.Block}.
 * @module
 */

import { get_css_printer } from "#node/css/_mod";
import { define_printer } from "#printer";
import type { Css } from "#types";
import { NEW_LINE, insert } from "#util";

/**
 * Print Svelte AST node {@link Css.Block} as string.
 */
export const print_css_block = define_printer((node: Css.Block, options) => {
	const { children } = node;
	const { indent } = options.format;

	return insert(
		"{",
		NEW_LINE,
		children
			.map((n) => {
				// WARN: This is workaround for cyclic dependency
				return insert(indent, get_css_printer(n)(n, options), NEW_LINE);
			})
			.join(""),
		"}",
		NEW_LINE,
	);
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
				<style>
					p {
						color: red;
						background-color: black;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Block>(code, "Block");
			expect(print_css_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{
					color: red;
					background-color: black;
				}
				"
			`);
		});
	});
}
