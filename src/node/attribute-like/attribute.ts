/**
 * Related to Svelte AST attribute-like nodes.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @module
 */

import { print_attribute_like_value } from "#node/attribute-like/shared";
import { define_printer } from "#printer";
import type { Attribute } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Attribute} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 */
export const print_attribute = define_printer((node: Attribute, _options) => {
	const { name } = node;
	const is_shorthand =
		node.value !== true &&
		node.value[0]?.type === "ExpressionTag" &&
		node.value[0].expression.type === "Identifier" &&
		node.value[0].expression.name === name;

	return insert(
		//
		!is_shorthand && name,
		print_attribute_like_value(node, { skip_assignment: is_shorthand }),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Attribute", () => {
		it("correctly prints boolean value", ({ expect }) => {
			const code = `
				<input required />
			`;
			const node = parse_and_extract_svelte_node<Attribute>(code, "Attribute");
			expect(print_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"required"`);
		});

		it("correctly prints empty text expression value", ({ expect }) => {
			const code = `
				<input required="" />
			`;
			const node = parse_and_extract_svelte_node<Attribute>(code, "Attribute");
			expect(print_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"required="""`);
		});

		it("correctly prints text expression value", ({ expect }) => {
			const code = `
				<div aria-label="this is a modal box" />
			`;
			const node = parse_and_extract_svelte_node<Attribute>(code, "Attribute");
			expect(print_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"aria-label="this is a modal box""`);
		});

		it("correctly prints booleanish expression tag value", ({ expect }) => {
			const code = `
				<button {disabled} />
			`;
			const node = parse_and_extract_svelte_node<Attribute>(code, "Attribute");
			expect(print_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{disabled}"`);
		});

		it("correctly prints expression tag value", ({ expect }) => {
			const code = `
				<Button id={\`button-\${id}\`} />
			`;
			const node = parse_and_extract_svelte_node<Attribute>(code, "Attribute");
			expect(print_attribute(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"id={\`button-\${id}\`}"`);
		});
	});
}
