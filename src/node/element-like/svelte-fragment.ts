/**
 * Related to Svelte AST node {@link SvelteFragment}.
 * @see {@link https://svelte.dev/docs/special-fragments#svelte-fragment}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { SvelteFragment } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteFragment} as string.
 *
 * @see {@link https://svelte.dev/docs/special-fragments#svelte-fragment}
 *
 * @example
 * ```svelte
 * <svelte:fragment slot="footer">
 *     <p>All rights reserved.</p>
 *     <p>Copyright (c) 2019 Svelte Industries</p>
 * </svelte:fragment>
 * ```
 */
export const print_svelte_fragment = define_printer((node: SvelteFragment, options) => {
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

	describe("SvelteFragment", () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
				<svelte:fragment slot="footer">
					<p>All rights reserved.</p>
					<p>Copyright (c) 2019 Svelte Industries</p>
				</svelte:fragment>
			`;
			const node = parse_and_extract_svelte_node<SvelteFragment>(code, "SvelteFragment");
			expect(print_svelte_fragment(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<svelte:fragment slot="footer">
					<p>All rights reserved.</p>
					<p>Copyright (c) 2019 Svelte Industries</p>
				</svelte:fragment>"
			`);
		});
	});
}
