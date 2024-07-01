/**
 * Related to Svelte AST {@link SpreadAttribute} node.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @module
 */
import { print } from "esrap";
import { define_printer } from "#printer";
import type { SpreadAttribute } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Attribute} as string.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 *
 * @example
 * ```html
 * <Widget {...things} />
 * ```
 */
export const print_spread_attribute = define_printer((node: SpreadAttribute, _options) => {
	const { expression } = node;

	return insert("{...", print(expression).code, "}");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("SpreadAttribute", () => {
		it("works using normal identifier", ({ expect }) => {
			const code = `
				<Widget {...things} />
			`;
			const node = parse_and_extract_svelte_node<SpreadAttribute>(code, "SpreadAttribute");
			expect(print_spread_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{...things}"`);
		});

		it("works using $$props", ({ expect }) => {
			const code = `
				<Widget {...$$props} />
			`;
			const node = parse_and_extract_svelte_node<SpreadAttribute>(code, "SpreadAttribute");
			expect(print_spread_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{...$$props}"`);
		});

		it("works using $$restProps", ({ expect }) => {
			const code = `
				<Widget {...$$restProps} />
			`;
			const node = parse_and_extract_svelte_node<SpreadAttribute>(code, "SpreadAttribute");
			expect(print_spread_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{...$$restProps}"`);
		});
	});
}
