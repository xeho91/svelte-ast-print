/**
 * Related to Svelte AST node {@link SvelteDocument}.
 * @see {@link https://svelte.dev/docs/special-elements#svelte-document}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteDocument } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteDocument} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#svelte-document}
 *
 * @example
 * ```svelte
 * <svelte:document bind:prop={value} on:visibilitychange={handleVisibilityChange} use:someAction />
 * ```
 */
export const print_svelte_document = define_printer((node: SvelteDocument, options) => {
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

	describe("SvelteDocument", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />
			`;
			const node = parse_and_extract_svelte_node<SvelteDocument>(code, "SvelteDocument");
			expect(print_svelte_document(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />"`,
			);
		});
	});
}
