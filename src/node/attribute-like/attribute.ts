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

	return insert(name, print_attribute_like_value(node));
});
