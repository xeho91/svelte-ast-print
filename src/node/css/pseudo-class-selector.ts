/**
 * Related to Svelte AST node {@link Css.PseudoClassSelector}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";
import { print_css_selector_list } from "./selector-list.js";

/**
 * Print Svelte AST node {@link Css.PseudoClassSelector} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
 */
export const print_css_pseudo_class_selector = define_printer((node: Css.PseudoClassSelector, options) => {
	const { args, name } = node;

	return insert(
		//
		":",
		name,
		args && insert("(", print_css_selector_list(args, options), ")"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.PseudoClassSelector", () => {
		it("prints correctly without args", ({ expect }) => {
			const code = `
				<style>
					p:hover {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.PseudoClassSelector>(code, "PseudoClassSelector");
			expect(print_css_pseudo_class_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":hover"`);
		});

		it("prints correctly with args", ({ expect }) => {
			const code = `
				<style>
					p:not(.error) {
						color: blue;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.PseudoClassSelector>(code, "PseudoClassSelector");
			expect(print_css_pseudo_class_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":not(.error)"`);
		});
	});
}
