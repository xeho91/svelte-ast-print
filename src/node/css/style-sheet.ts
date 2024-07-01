/**
 * Related to Svelte AST node {@link Css.StyleSheet}.
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.StyleSheet} as string.
 *
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 */
export const print_css_style_sheet = define_printer((node: Css.StyleSheet, options) => {
	const { attributes, children } = node;

	return insert(
		"<style",
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		">",
		// TODO: Print children
		"</style>",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.StyleSheet", () => {
		it("it prints correctly attributes", ({ expect }) => {
			const code = `
				<style lang="sass">
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.StyleSheet>(code, "StyleSheet");
			expect(print_css_style_sheet(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"<style lang="sass"></style>"`);
		});
	});
}
