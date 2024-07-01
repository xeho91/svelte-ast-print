/**
 * Related to Svelte AST {@link ClassDirective} node.
 * @module
 */

import { print } from "esrap";
import { define_printer } from "#printer";
import type { ClassDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link ClassDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#class-name}
 *
 * @example with value
 * ```svelte
 * class:name={value}
 * ```
 *
 * @example without value
 * ```svelte
 * class:name
 * ```
 */
export const print_class_directive = define_printer((node: ClassDirective, _options) => {
	const { name, expression } = node;
	const is_shorthand = expression.type === "Identifier" && expression.name === name;

	return insert(
		//
		"class",
		":",
		name,
		!is_shorthand && insert("={", print(expression).code, "}"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("ClassDirective", () => {
		it("works with value", ({ expect }) => {
			const code = `
				<div class:active={isActive}>...</div>
			`;
			const node = parse_and_extract_svelte_node<ClassDirective>(code, "ClassDirective");
			expect(print_class_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"class:active={isActive}"`);
		});

		it("works without value - shorthand", ({ expect }) => {
			const code = `
				<div class:active>...</div>
			`;
			const node = parse_and_extract_svelte_node<ClassDirective>(code, "ClassDirective");
			expect(print_class_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"class:active"`);
		});
	});
}
