/**
 * Related to Svelte AST node {@link Css.RelativeSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";
import { get_css_printer } from "./_mod.js";
import { print_css_combinator } from "./combinator.js";

/**
 * Print Svelte AST node {@link Css.RelativeSelector} as string.
 */
export const print_css_relative_selector = define_printer((node: Css.RelativeSelector, options) => {
	const { combinator, selectors } = node;

	return insert(
		combinator && insert(" ", print_css_combinator(combinator, options)),
		selectors
			.map((simple_selector) => {
				// WARN: This is to avoid cyclic dependency
				return get_css_printer(simple_selector)(simple_selector, options);
			})
			.join(""),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.RelativeSelector", () => {
		it("prints correctly without combinator", ({ expect }) => {
			const code = `
				<style>
					p {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.RelativeSelector>(code, "RelativeSelector");
			expect(print_css_relative_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"p"`);
		});

		it("prints correctly with combinator", ({ expect }) => {
			const code = `
				<style>
					p ~ .error {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.RelativeSelector>(code, "RelativeSelector");
			expect(print_css_relative_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"p"`);
		});
	});
}
