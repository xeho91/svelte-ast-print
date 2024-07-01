/**
 * Related to Svelte AST node {@link Css.Atrule}.
 * @module
 */

import { define_printer } from "#printer";
import type { Css } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Css.Atrule} as string.
 */
export const print_css_atrule = define_printer((node: Css.Atrule, options) => {
	return "";
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.Atrule", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style lang="sass">
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Atrule>(code, "Atrule");
			expect(print_css_atrule(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"<style lang="sass"></style>"`);
		});
	});
}
