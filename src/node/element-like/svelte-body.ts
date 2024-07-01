/**
 * Related to Svelte AST node {@link SvelteBody}.
 * @see {@link https://svelte.dev/docs/special-elements#svelte-body}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteBody } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteBody} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#svelte-body}
 *
 * @example
 * ```svelte
 * <svelte:body on:event={handler} />
 * ```
 */
export const print_svelte_body = define_printer((node: SvelteBody, options) => {
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

	describe("SvelteBody", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />
			`;
			const node = parse_and_extract_svelte_node<SvelteBody>(code, "SvelteBody");
			expect(print_svelte_body(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />"`,
			);
		});
	});
}
