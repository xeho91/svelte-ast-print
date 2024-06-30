/**
 * Related to Svelte AST node {@link HtmlTag}.
 * @see {@link https://svelte.dev/docs/special-tags#html}
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { HtmlTag } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link HtmlTag} as string.
 * @see {@link https://svelte.dev/docs/special-tags#html}
 *
 * @example pattern
 * ```svelte
 * {@html expression}
 * ```
 */
export const print_html_tag = define_printer((node: HtmlTag, _options) => {
	const { expression } = node;

	return insert("{@html ", print(expression).code, "}");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("HtmlTag", () => {
		it("prints correctly when used in an example case", ({ expect }) => {
			const code = `
				<div class="blog-post">
					<h1>{post.title}</h1>
					{@html post.content}
				</div>
			`;
			const node = parse_and_extract_svelte_node<HtmlTag>(code, "HtmlTag");
			expect(print_html_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{@html post.content}"`);
		});
	});
}
