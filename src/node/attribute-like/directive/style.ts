/**
 * Related to Svelte AST {@link StyleDirective} node.
 * @module
 */

import { print_attribute_like_value } from "#node/attribute-like/shared";
import { define_printer } from "#printer";
import type { StyleDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link StyleDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#style-property}
 *
 * @example with expression tag
 * ```svelte
 * style:property={value}
 * ```
 *
 * @example with text expression
 * ```svelte
 * style:property="text"
 * ```
 *
 * @example without expression
 * ```svelte
 * style:property
 * ```
 *
 * @example with modifiers
 * ```svelte
 * style:property|modifiers="text"
 *
 */
export const print_style_directive = define_printer((node: StyleDirective, _options) => {
	const { name, modifiers } = node;

	return insert(
		"style",
		":",
		name,
		modifiers.length > 0 && "|",
		modifiers.join("|"),
		print_attribute_like_value(node),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("StyleDirective", () => {
		it("works with expression tag value", ({ expect }) => {
			const code = `
				<div style:color={myColor}>...</div>
			`;
			const node = parse_and_extract_svelte_node<StyleDirective>(code, "StyleDirective");
			expect(print_style_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"style:color={myColor}"`);
		});

		it("works with shorthand", ({ expect }) => {
			const code = `
				<div style:color>...</div>
			`;
			const node = parse_and_extract_svelte_node<StyleDirective>(code, "StyleDirective");
			expect(print_style_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"style:color"`);
		});

		it("works with text expression", ({ expect }) => {
			const code = `
				<div style:color="red">...</div>
			`;
			const node = parse_and_extract_svelte_node<StyleDirective>(code, "StyleDirective");
			expect(print_style_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"style:color="red""`);
		});

		it("works with modifiers and text expression", ({ expect }) => {
			const code = `
				<div style:color|important="red">...</div>
			`;
			const node = parse_and_extract_svelte_node<StyleDirective>(code, "StyleDirective");
			expect(print_style_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"style:color|important="red""`);
		});
	});
}
