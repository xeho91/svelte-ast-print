/**
 * Related to Svelte AST node {@link SlotElement}.
 * @see {@link https://svelte.dev/docs/special-elements#slot}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { SlotElement } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SlotElement} as string.
 * @see {@link https://svelte.dev/docs/special-elements#slot}
 */
export const print_slot_element = define_printer((node: SlotElement, options) => {
	const { attributes, fragment, name } = node;
	const is_self_closing = fragment.nodes.length === 0;

	return insert(
		"<",
		name,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		is_self_closing ? " />" : ">",
		!is_self_closing && insert(print_fragment(fragment, options), `</${name}>`),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("SlotElement", () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
				<slot name="description" />
			`;
			const node = parse_and_extract_svelte_node<SlotElement>(code, "SlotElement");
			expect(print_slot_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"<slot name="description" />"`);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
				<div>
					<slot name="header">No header was provided</slot>
					<p>Some content between header and footer</p>
				</div>
			`;
			const node = parse_and_extract_svelte_node<SlotElement>(code, "SlotElement");
			expect(print_slot_element(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<slot name="header">No header was provided</slot>"`,
			);
		});
	});
}
