/**
 * Related to Svelte AST node {@link SvelteWindow}.
 * @see {@link https://svelte.dev/docs/special-windows#svelte-window}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { SvelteWindow } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteWindow} as string.
 *
 * @see {@link https://svelte.dev/docs/special-windows#svelte-window}
 *
 * @example
 * ```svelte
 * <svelte:window bind:prop={value} on:keydown={handleKeydown} />
 * ```
 */
export const print_svelte_window = define_printer((node: SvelteWindow, options) => {
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

	describe("SvelteWindow", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<script>
					/** @param {KeyboardEvent} event */
					function handleKeydown(event) {
						alert(\`pressed the \${event.key} key\`);
					}
				</script>

				<svelte:window on:keydown={handleKeydown} />
			`;
			const node = parse_and_extract_svelte_node<SvelteWindow>(code, "SvelteWindow");
			expect(print_svelte_window(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<svelte:window on:keydown={handleKeydown} />"`,
			);
		});
	});
}
