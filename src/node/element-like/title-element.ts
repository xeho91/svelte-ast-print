/**
 * Related to Svelte AST node {@link TitleElement}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { TitleElement } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link TitleElement} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 */
export const print_title_element = define_printer((node: TitleElement, options) => {
	const { attributes, fragment, name } = node;

	return insert(
		//
		"<",
		name,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		">",
		print_fragment(fragment, options),
		`</${name}>`,
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("TitleElement", () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
				<script>
					const reason = "vibes";
				</script>

				<svelte:head>
					<title>Svelte is optimized for {reason}</title>
				</svelte:head>
			`;
			const node = parse_and_extract_svelte_node<TitleElement>(code, "TitleElement");
			expect(print_title_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<title>Svelte is optimized for {reason}</title>"`,
			);
		});
	});
}
