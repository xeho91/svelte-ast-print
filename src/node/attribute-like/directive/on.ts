/**
 * Related to Svelte AST {@link OnDirective} node.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { OnDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link OnDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/special-elements#on-eventname}
 *
 * @example without modifiers
 * ```svelte
 * on:eventname={handler}
 * ```
 *
 * @example with modifiers
 * ```svelte
 * on:eventname|modifiers={handler}
 * ```
 */
export const print_on_directive = define_printer((node: OnDirective, _options) => {
	const { expression, name, modifiers } = node;

	return insert(
		"on",
		":",
		name,
		modifiers.length > 0 && "|",
		modifiers.join("|"),
		expression && insert("={", print(expression).code, "}"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("OnDirective", () => {
		it("works on without modifiers variant", ({ expect }) => {
			const code = `
				<button on:click={() => (count += 1)}>
					count: {count}
				</button>
			`;
			const node = parse_and_extract_svelte_node<OnDirective>(code, "OnDirective");
			expect(print_on_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"on:click={() => count += 1}"`);
		});

		it("works on with modifiers variant", ({ expect }) => {
			const code = `
				<form on:submit|preventDefault={handleSubmit}>
					...
				</form>
			`;
			const node = parse_and_extract_svelte_node<OnDirective>(code, "OnDirective");
			expect(print_on_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"on:submit|preventDefault={handleSubmit}"`,
			);
		});
	});
}
