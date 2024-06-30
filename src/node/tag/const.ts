/**
 * Related to Svelte AST node {@link ConstTag}.
 * @see {@link https://svelte.dev/docs/special-tags#const}
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { ConstTag } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link ConstTag} as string.
 * @see {@link https://svelte.dev/docs/special-tags#const}
 *
 * @example pattern
 * ```svelte
 * {@const assignment}
 * ```
 */
export const print_const_tag = define_printer((node: ConstTag, _options) => {
	const { declaration } = node;

	return insert(
		"{@",
		// NOTE: It removes the semicolon
		print(declaration).code.slice(0, -1),
		"}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("ConstTag", () => {
		it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
			const code = `
				{#each boxes as box}
					{@const area = box.width * box.height}
					{box.width} * {box.height} = {area}
				{/each}
			`;
			const node = parse_and_extract_svelte_node<ConstTag>(code, "ConstTag");
			expect(print_expression_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"{@const area = box.width * box.height}"`,
			);
		});
	});
}
