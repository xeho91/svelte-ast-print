/**
 * Related to Svelte AST node {@link ExpressionTag}.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { ExpressionTag } from "#types";

/**
 * Print Svelte AST node {@link ExpressionTag} as string.
 *
 * @example expression - a possibly reactive template expression
 * ```svelte
 * {...}
 * ```
 */
export const print_expression_tag = define_printer((node: ExpressionTag, _options) => {
	const { expression } = node;
	return [
		//
		"{",
		print(expression).code,
		"}",
	].join("");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("ExpressionTag", () => {
		it("correctly prints an reactive and simple Svelte expression in template", ({ expect }) => {
			const code = "{name}";
			const node = parse_and_extract_svelte_node<ExpressionTag>(code, "ExpressionTag");
			expect(print_expression_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{name}"`);
		});

		it("supports dot notation", ({ expect }) => {
			const code = "{svelte.is.the.best.framework}";
			const node = parse_and_extract_svelte_node<ExpressionTag>(code, "ExpressionTag");
			expect(print_expression_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"{svelte.is.the.best.framework}"`,
			);
		});

		it("supports brackets notation and question mark", ({ expect }) => {
			const code = "{svelte[5].release?.date}";
			const node = parse_and_extract_svelte_node<ExpressionTag>(code, "ExpressionTag");
			expect(print_expression_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{svelte[5].release?.date}"`);
		});
	});
}
