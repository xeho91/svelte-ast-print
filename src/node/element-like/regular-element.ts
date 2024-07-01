/**
 * Related to Svelte AST node {@link RegularElement}.
 * @see {@link https://svelte.dev/docs/svelte-components}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { RegularElement } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link RegularElement} as string.
 * @see {@link https://svelte.dev/docs/svelte-components}
 */
export const print_regular_element = define_printer((node: RegularElement, options) => {
	const { attributes, fragment, name } = node;
	const is_self_closing = fragment.nodes.length === 0;

	return insert(
		"<",
		name,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		is_self_closing ? " />" : ">",
		!is_self_closing &&
			insert(
				//
				print_fragment(fragment, options),
				`</${name}>`,
			),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("RegularElement", () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
				<input
					bind:value min={0}
					--rail-color="black"
					--track-color="rgb(0, 0, 255)"
				/>
			`;
			const node = parse_and_extract_svelte_node<RegularElement>(code, "RegularElement");
			expect(print_regular_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<input bind:value={value} min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />"`,
			);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
				<button on:click={increment}>
					Clicked {count}
					{count === 1 ? 'time' : 'times'}
				</button>
			`;
			const node = parse_and_extract_svelte_node<RegularElement>(code, "RegularElement");
			expect(print_regular_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<button on:click={increment}>
					Clicked {count}
					{count === 1 ? 'time' : 'times'}
				</button>"
			`);
		});
	});
}
