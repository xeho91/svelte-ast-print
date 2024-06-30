/**
 * Related to Svelte AST node {@link KeyBlock}.
 * @see {@link https://svelte.dev/docs/logic-blocks#key}
 * @module
 */

import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { KeyBlock } from "#types";

/**
 * Print Svelte AST node {@link KeyBlock} as string.
 * @see {@link https://svelte.dev/docs/logic-blocks#key}
 *
 * @example pattern
 * ```svelte
 * {#key expression}...{/key}
 * ```
 */
export const print_key_block = define_printer((node: KeyBlock, options) => {
	const { expression, fragment } = node;
	return [
		//
		"{#key ",
		print(expression).code,
		"}",
		print_fragment(fragment, options),
		"{/key}",
	].join("");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("KeyBlock", () => {
		it("correctly prints the block", ({ expect }) => {
			const code1 = `
				{#key value}
					<div transition:fade>{value}</div>
				{/key}
			`;
			const node1 = parse_and_extract_svelte_node<KeyBlock>(code1, "KeyBlock");
			expect(print_key_block(node1, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#key value}
					<div transition:fade>{value}</div>
				{/key}"
			`);
			const code2 = `
				{#key value}
					<Component />
				{/key}
			`;
			const node2 = parse_and_extract_svelte_node<KeyBlock>(code2, "KeyBlock");
			expect(print_key_block(node2, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#key value}
					<Component />
				{/key}"
			`);
		});
	});
	//
}
