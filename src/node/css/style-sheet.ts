/**
 * Related to Svelte AST node {@link Css.StyleSheet}.
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { Css } from "#types";
import { NEW_LINE, insert } from "#util";
import { print_css_atrule } from "./atrule.js";
import { print_css_rule } from "./rule.js";

/**
 * Print Svelte AST node {@link Css.StyleSheet} as string.
 *
 * @see {@link https://svelte.dev/docs/svelte-components#style}
 */
export const print_css_style_sheet = define_printer((node: Css.StyleSheet, options) => {
	const { attributes, children } = node;
	const { indent } = options.format;

	return insert(
		"<style",
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		">",
		NEW_LINE,
		children
			.map((n) => {
				return insert(
					indent,
					n.type === "Atrule" && print_css_atrule(n, options),
					n.type === "Rule" && print_css_rule(n, options),
				);
			})
			.join(NEW_LINE),
		"</style>",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.StyleSheet", () => {
		it("it prints correctly attributes", ({ expect }) => {
			const code = `
				<style lang="sass">
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.StyleSheet>(code, "StyleSheet");
			expect(print_css_style_sheet(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<style lang="sass">
				</style>"
			`);
		});

		it("it prints correctly advanced styles", ({ expect }) => {
			const code = `
				<style>
					@layer component {
						@container toast (max-width: 426px) {
							.toast ~ [aria-live="polite"] {
								/**/
							}
						}

						.toast {
							transition-duration: var(--transition-dur);
							transition-timing-function: var(--transition-fn);

							transition-property:
								var(--transition-props-color),
								var(--transition-props-shadow);
						}
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.StyleSheet>(code, "StyleSheet");
			expect(print_css_style_sheet(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<style>
					@layer component {
					@container toast (max-width: 426px) {
					.toast ~[aria-live="polite"] {
				}

				}

					.toast {
					transition-duration: var(--transition-dur);
					transition-timing-function: var(--transition-fn);
					transition-property: var(--transition-props-color),
								var(--transition-props-shadow);
				}

				}
				</style>"
			`);
		});
	});
}
