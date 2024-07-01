/**
 * Related to Svelte AST node {@link SvelteOptions}.
 * @see {@link https://svelte.dev/docs/special-optionss#svelte-options}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { Root, SvelteOptionsRaw } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SvelteOptionsRaw} as string.
 *
 * WARN: This one is different, because it can be extracted only from {@link Root}
 *
 * @see {@link https://svelte.dev/docs/special-optionss#svelte-options}
 *
 * @example
 * ```svelte
 * <svelte:options option={value} />
 * ```
 */
export const print_svelte_options = define_printer((node: SvelteOptionsRaw, options) => {
	return insert(
		"<svelte:options",
		(node as unknown as Root).options &&
			insert(
				((node as unknown as Root).options as NonNullable<Root["options"]>).attributes.length > 0 && " ",
				print_attributes(
					//
					((node as unknown as Root).options as NonNullable<Root["options"]>).attributes,
					options,
				),
			),
		" />",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("SvelteOptions", () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:options
					customElement={{
						tag: 'custom-element',
						shadow: 'none',
						props: {
							name: { reflect: true, type: 'Number', attribute: 'element-index' }
						},
						extend: (customElementConstructor) => {
							// Extend the class so we can let it participate in HTML forms
							return class extends customElementConstructor {
								static formAssociated = true;

								constructor() {
									super();
									this.attachedInternals = this.attachInternals();
								}

								// Add the function here, not below in the component so that
								// it's always available, not just when the inner Svelte component
								// is mounted
								randomIndex() {
									this.elementIndex = Math.random();
								}
							};
						}
					}}
				/>
			`;
			const node = parse_and_extract_svelte_node<Root>(code, "Root");
			expect(print_svelte_options(node as unknown as SvelteOptionsRaw, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<svelte:options customElement={{
					tag: 'custom-element',
					shadow: 'none',
					props: {
						name: {
							reflect: true,
							type: 'Number',
							attribute: 'element-index'
						}
					},
					extend: (customElementConstructor) => {
						// Extend the class so we can let it participate in HTML forms
						return class extends customElementConstructor {
							static formAssociated = true;

							constructor() {
								super();
								this.attachedInternals = this.attachInternals();
							}

							// Add the function here, not below in the component so that
							// it's always available, not just when the inner Svelte component
							// is mounted
							randomIndex() {
								this.elementIndex = Math.random();
							}
						};
					}
				}} />"
			`);
		});
	});
}
