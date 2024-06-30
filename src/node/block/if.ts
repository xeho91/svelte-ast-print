/**
 * Related to Svelte AST node {@link IfBlock}.
 * @see {@link https://svelte.dev/docs/logic-blocks#if}
 * @module
 */

import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { Fragment, IfBlock } from "#types";
import { insert } from "#util";

const has_alternate_else_if = (node: Fragment): boolean => node.nodes.some((n) => n.type === "IfBlock");

/**
 * Print Svelte AST node {@link IfBlock} as string.
 * @see {@link https://svelte.dev/docs/logic-blocks#if}
 *
 * @example simple
 * ```svelte
 * {#if expression}...{/if}
 * ```
 *
 * @example with else if
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example with else
 * ```svelte
 * {#if expression}...{:else}...{/if}
 * ```
 *
 * @example with else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else}...{/if}
 * ```
 *
 * @example with multiple else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else if expression}...{:else}...{/if}
 * ```
 */
export const print_if_block = define_printer((node: IfBlock, options) => {
	const { alternate, consequent, elseif, test } = node;

	if (elseif) {
		return insert(
			"{:else if",
			" ",
			print(test).code,
			"}",
			print_fragment(consequent, options),
			alternate && insert(!has_alternate_else_if(alternate) && "{:else}", print_fragment(alternate, options)),
		);
	}

	return insert(
		"{#if",
		" ",
		print(test).code,
		"}",
		print_fragment(consequent, options),
		alternate && insert(!has_alternate_else_if(alternate) && "{:else}", print_fragment(alternate, options)),
		"{/if}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("IfBlock", () => {
		it("correctly prints simple {#if} block", ({ expect }) => {
			const code = `
				{#if test}
					<span>simple if</span>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<IfBlock>(code, "IfBlock");
			expect(print_if_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#if test}
					<span>simple if</span>
				{/if}"
			`);
		});

		it("correctly prints {#if} block with {:else}", ({ expect }) => {
			const code = `
				{#if test}
					<span>if body</span>
				{:else}
					<span>else body</span>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<IfBlock>(code, "IfBlock");
			expect(print_if_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#if test}
					<span>if body</span>
				{:else}
					<span>else body</span>
				{/if}"
			`);
		});

		it("correctly prints {#if} block with {:else if}", ({ expect }) => {
			const code = `
				{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body</span>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<IfBlock>(code, "IfBlock");
			expect(print_if_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body</span>
				{/if}"
			`);
		});

		it("correctly prints {#if} block with {:else if} and {:else}", ({ expect }) => {
			const code = `
				{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body</span>
				{:else}
					<span>else body</span>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<IfBlock>(code, "IfBlock");
			expect(print_if_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body</span>
				{:else}
					<span>else body</span>
				{/if}"
			`);
		});

		it("correctly prints {#if} block with multiple {:else if} and {:else}", ({ expect }) => {
			const code = `
				{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body1</span>
				{:else if test3}
					<span>else if body2</span>
				{:else}
					<span>else body</span>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<IfBlock>(code, "IfBlock");
			expect(print_if_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#if test1}
					<span>if body</span>
				{:else if test2}
					<span>else if body1</span>
				{:else if test3}
					<span>else if body2</span>
				{:else}
					<span>else body</span>
				{/if}"
			`);
		});
	});
}
