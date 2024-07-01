/**
 * Related to standard HTML nodes.
 * @module
 */

import { define_printer } from "#printer";
import type { Comment, HtmlNode, Text } from "#types";

export const print_html_node = define_printer((node: HtmlNode, options) => {
	if (node.type === "Comment") {
		return print_comment(node, options);
	}

	return print_text(node, options);
});

/**
 * Print Svelte AST node {@link Comment} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment}
 *
 * @example pattern
 * ```html
 * <!-- text -->
 * ```
 */
export const print_comment = define_printer((node: Comment, _options) => {
	return `<!--${node.data}-->`;
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Comment", () => {
		it("prints correctly a single line comment from random code", ({ expect }) => {
			const code = `
				{#each boxes as box}
					<!-- This is a single line comment -->
					{@const area = box.width * box.height}
					{box.width} * {box.height} = {area}
				{/each}
			`;
			const node = parse_and_extract_svelte_node<Comment>(code, "Comment");
			expect(print_comment(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<!-- This is a single line comment -->"`,
			);
		});

		it("supports multiple line comment", ({ expect }) => {
			const code = `
				<!--
					This
					is
					multiple
					line
					comment
				-->
			`;
			const node = parse_and_extract_svelte_node<Comment>(code, "Comment");
			expect(print_comment(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<!--
					This
					is
					multiple
					line
					comment
				-->"
			`,
			);
		});
	});
}

/**
 * Print Svelte AST node {@link Text} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text}
 *
 * @example pattern
 * ```html
 * text
 * ```
 */
export const print_text = define_printer((node: Text, _options) => {
	return node.data;
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Text", () => {
		it("prints correctly a random text comment from random code", ({ expect }) => {
			const code = `
				<span>Catch me if you can</span>
			`;
			const node = parse_and_extract_svelte_node<Text>(code, "Text");
			expect(print_text(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"Catch me if you can"`);
		});
	});
}
