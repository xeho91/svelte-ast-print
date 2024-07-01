/**
 * Related to Svelte AST node {@link SvelteSelf}.
 * @see {@link https://svelte.dev/docs/special-selfs#svelte-self}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteSelf } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteSelf} as string.
 *
 * @see {@link https://svelte.dev/docs/special-selfs#svelte-self}
 *
 * @example
 * ```svelte
 *  <svelte:self count={count - 1} />
 * ```
 */
export const print_svelte_self = define_printer((node: SvelteSelf, options) => {
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

	describe("SvelteSelf", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				{#if count > 0}
					<p>counting down... {count}</p>
					<svelte:self count={count - 1} />
				{:else}
					<p>lift-off!</p>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<SvelteSelf>(code, "SvelteSelf");
			expect(print_svelte_self(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:self count={count - 1} />"`,
			);
		});
	});
}
