/**
 * Related to Svelte AST node {@link Css.ClassSelector}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.ClassSelector} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors}
 *
 * @example simple
 * ```css
 * .class_name { style properties }
 * ```
 *
 * @example equivalent
 * ```css
 * [class~=class_name] { style properties }
 * ```
 */
export const print_css_class_selector = define_printer((node: Css.ClassSelector, _options) => {
	const { name } = node;

	return insert(".", name);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.ClassSelector", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					.svelte-is-awesome {}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.ClassSelector>(code, "ClassSelector");
			expect(print_css_class_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`".svelte-is-awesome"`);
		});
	});
}
