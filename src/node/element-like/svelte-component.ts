/**
 * Related to Svelte AST node {@link SvelteComponent}.
 * @see {@link https://svelte.dev/docs/special-elements#svelte-component}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteComponent } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteComponent} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#svelte-component}
 *
 * @example
 * ```svelte
 * <svelte:component this={currentSelection.component} foo={bar} />
 * ```
 */
export const print_svelte_component = define_printer((node: SvelteComponent, options) => {
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

	describe("SvelteComponent", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:component this={currentSelection.component} foo={bar} />
			`;
			const node = parse_and_extract_svelte_node<SvelteComponent>(code, "SvelteComponent");
			expect(print_svelte_component(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:component foo={bar} />"`,
			);
		});
	});
}
