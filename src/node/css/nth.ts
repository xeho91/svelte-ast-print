/**
 * Related to Svelte AST node {@link Css.Nth}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child}
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.Nth} as string.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child}
 *
 * @example syntax
 * ```css
 * :nth-child(<nth> [of <complex-selector-list>]?) { }
 */
export const print_css_nth = define_printer((node: Css.Nth, _options) => {
	const { value } = node;

	return insert(":nth-child(", value, ")");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Nth", () => {
		it("prints correctly simple number", ({ expect }) => {
			const code = `
				<style>
					p:nth-child(1) {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
			expect(print_css_nth(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":nth-child(1)"`);
		});

		it("prints correctly text value", ({ expect }) => {
			const code = `
				<style>
					p:nth-child(odd) {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
			expect(print_css_nth(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":nth-child(odd)"`);
		});

		it("prints correctly math-like value", ({ expect }) => {
			const code = `
				<style>
					p:nth-child(-1n + 5) {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
			expect(print_css_nth(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":nth-child(-1n + 5)"`);
		});

		// FIXME: This is a bug in Svelte, because parser treats it as class selector(?)
		it.fails("prints correctly advanced value", ({ expect }) => {
			const code = `
				<style>
					p:nth-child(even of .noted) {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
			expect(print_css_nth(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`":nth-child(even of .noted)"`);
		});
	});
}
