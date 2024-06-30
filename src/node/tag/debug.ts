/**
 * Related to Svelte AST node {@link DebugTag}.
 * @see {@link https://svelte.dev/docs/special-tags#debug}
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { DebugTag } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link DebugTag} as string.
 * @see {@link https://svelte.dev/docs/special-tags#debug}
 *
 * @example pattern
 * ```svelte
 * {@debug var1, var2, ..., varN}
 * ```
 */
export const print_debug_tag = define_printer((node: DebugTag, _options) => {
	const { identifiers } = node;
	node.identifiers;

	return insert(
		"{@debug",
		// Don't add a space when list is empty
		identifiers.length > 0 && " ",
		identifiers.map((i) => print(i).code).join(", "),
		"}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("DebugTag", () => {
		it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
			const code = `
				<script>
					let user = {
						firstname: 'Ada',
						lastname: 'Lovelace'
					};
				</script>

				{@debug user}

				<h1>Hello {user.firstname}!</h1>
			`;
			const node = parse_and_extract_svelte_node<DebugTag>(code, "DebugTag");
			expect(print_debug_tag(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"{@debug user}"`);
		});
	});
}
