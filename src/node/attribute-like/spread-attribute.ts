/**
 * Related to Svelte AST {@link SpreadAttribute} node.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * @module
 */
import { print } from "esrap";
import { define_printer } from "#printer";
import type { SpreadAttribute } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Attribute} as string.
 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 *
 * @example
 * ```html
 * <Widget {...things} />
 * ```
 */
export const print_spread_attribute = define_printer((node: SpreadAttribute, _options) => {
	const { expression } = node;

	return insert("{...", print(expression).code, "}");
});
