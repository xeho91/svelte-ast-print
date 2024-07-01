/**
 * Related to Svelte AST node {@link SvelteElement}.
 * @see {@link https://svelte.dev/docs/special-elements#svelte-element}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteElement } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteElement} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#svelte-element}
 *
 * @example
 * ```svelte
 * <svelte:element this={tag} on:click={handler}>Foo</svelte:element>
 * ```
 */
export const print_svelte_element = define_printer((node: SvelteElement, options) => {
	const { attributes, name } = node;

	return insert(
		//
		"<",
		name,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		" />",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("SvelteElement", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:element this={tag} on:click={handler}>Foo</svelte:element>
			`;
			const node = parse_and_extract_svelte_node<SvelteElement>(code, "SvelteElement");
			expect(print_svelte_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:element on:click={handler} />"`,
			);
		});
	});
}
