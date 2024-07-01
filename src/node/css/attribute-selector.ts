/**
 * Related to Svelte AST node {@link Css.AttributeSelector}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.AttributeSelector} as string.
 */
export const print_css_attribute_selector = define_printer((node: Css.AttributeSelector, _options) => {
	const { flags, matcher, name, value } = node;

	return insert(
		//
		"[",
		name,
		matcher,
		value && `"${value}"`,
		flags && ` ${flags}`,
		"]",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.AttributeSelector", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<style>
					div[aria-disabled="true" lower] {
						/**/
				}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.AttributeSelector>(code, "AttributeSelector");
			expect(print_css_attribute_selector(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"[aria-disabled="true" lower]"`,
			);
		});
	});
}
