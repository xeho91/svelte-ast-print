/**
 * Related to Svelte AST node {@link Tag}.
 * @see {@link https://svelte.dev/docs/special-tags#html}
 * @module
 */

import { print_const_tag } from "#node/tag/const";
import { print_debug_tag } from "#node/tag/debug";
import { print_expression_tag } from "#node/tag/expression";
import { print_html_tag } from "#node/tag/html";
import { print_render_tag } from "#node/tag/render";
import { define_printer } from "#printer";
import type { Tag } from "#types";

/**
 * Print Svelte AST node {@link Tag} as string.
 * @see {@link https://svelte.dev/docs/special-tags}
 */
export const print_tag = define_printer((node: Tag, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "ConstTag": return print_const_tag(node, options);
		case "DebugTag": return print_debug_tag(node, options)
		case "ExpressionTag": return print_expression_tag(node, options);
		case "HtmlTag": return print_html_tag(node, options);
		case "RenderTag": return print_render_tag(node, options);
	}
});
