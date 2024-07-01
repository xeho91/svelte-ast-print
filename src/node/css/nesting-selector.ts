/**
 * Related to Svelte AST node {@link Css.NestingSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.NestingSelector} as string.
 */
export const print_css_nesting_selector = define_printer((node: Css.NestingSelector, _options) => {
	return node.name;
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.NestingSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					p {
						& span {
							color: orange;
						}
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.NestingSelector>(code, "NestingSelector");
			expect(print_css_nesting_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"&"`);
		});
	});
}
