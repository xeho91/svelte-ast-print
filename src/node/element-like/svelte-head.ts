/**
 * Related to Svelte AST node {@link SvelteHead}.
 * @see {@link https://svelte.dev/docs/special-heads#svelte-head}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { SvelteHead } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteHead} as string.
 *
 * @see {@link https://svelte.dev/docs/special-heads#svelte-head}
 *
 * @example
 * ```svelte
 * <svelte:head>
 *     <title>Hello world!</title>
 *     <meta name="description" content="This is where the description goes for SEO" />
 * </svelte:head>
 * ```
 */
export const print_svelte_head = define_printer((node: SvelteHead, options) => {
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

	describe("SvelteHead", () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
				<svelte:head>
					<title>Hello world!</title>
					<meta name="description" content="This is where the description goes for SEO" />
				</svelte:head>
			`;
			const node = parse_and_extract_svelte_node<SvelteHead>(code, "SvelteHead");
			expect(print_svelte_head(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<svelte:head>
					<title>Hello world!</title>
					<meta name="description" content="This is where the description goes for SEO" />
				</svelte:head>"
			`);
		});
	});
}
