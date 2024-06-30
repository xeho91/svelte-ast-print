/**
 * Related to Svelte AST {@link AttributeLike} nodes.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @module
 */

import { print_attribute } from "#node/attribute-like/attribute";
import { print_directive } from "#node/attribute-like/directive";
import { print_spread_attribute } from "#node/attribute-like/spread-attribute";
import { define_printer } from "#printer";
import type { AttributeLike } from "#types";

/**
 * Print Svelte AST node {@link AttributeLike} as string.
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @see {@link https://svelte.dev/docs/component-directives}
 * @see {@link https://svelte.dev/docs/element-directives}
 */
export const print_attribute_like = define_printer((node: AttributeLike, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "Attribute": return print_attribute(node, options);
		case "SpreadAttribute": return print_spread_attribute(node, options);
		case "AnimateDirective":
		case "BindDirective":
		case "ClassDirective":
		case "LetDirective":
		case "OnDirective":
		case "StyleDirective":
		case "TransitionDirective":
		case "UseDirective": return print_directive(node, options);
	}
});

export function print_attributes(
	attributes: Array<Parameters<typeof print_attribute_like>[0]>,
	options: Parameters<typeof print_attribute_like>[1],
): string {
	if (attributes.length === 0) return "";

	const stringified = attributes.map((a) => print_attribute_like(a, options)).join(" ");

	return ` ${stringified}`;
}
