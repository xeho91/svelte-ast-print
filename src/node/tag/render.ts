/**
 * Related to Svelte AST node {@link RenderTag}.
 * TODO: Update link once Svelte v5 is released
 * @see {@link https://svelte.dev/docs/special-tags#html}
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { RenderTag } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link RenderTag} as string.
 * TODO: Update link once Svelte v5 is released
 * @see {@link https://svelte.dev/docs/special-tags#html}
 *
 * @example pattern
 * ```svelte
 * {@render expression}
 * ```
 */
export const print_render_tag = define_printer((node: RenderTag, _options) => {
	const { expression } = node;

	return insert("{@render ", print(expression).code, "}");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("RenderTag", () => {
		it("prints correctly when used in an example case", ({ expect }) => {
			const code = `
				{#snippet hello(name)}
					<p>hello {name}! {message}!</p>
				{/snippet}

				{@render hello('alice')}
			`;
			const node = parse_and_extract_svelte_node<RenderTag>(code, "RenderTag");
			expect(print_render_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{@render hello('alice')}"`);
		});
	});
}
