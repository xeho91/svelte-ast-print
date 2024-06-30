/**
 * Related to Svelte AST {@link Directive} nodes.
 * @module
 */

import { print } from "esrap";

import { print_attribute_like_value } from "#node/attribute-like/shared";
import type { Expression } from "estree";
import { define_printer } from "#printer";
import type { Directive } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Directive} as string.
 * @see {@link https://svelte.dev/docs/component-directives}
 * @see {@link https://svelte.dev/docs/element-directives}
 *
 * @example bind
 * ```html
 * <button bind:this />
 * ```
 *
 * @example class
 * ```html
 * <button class:primary />
 * ```
 *
 * @example style
 * ```html
 * <div style:--bg-color="red" />
 * ```
 */
export const print_directive = define_printer((node: Directive, _options) => {
	const { name } = node;

	return insert(print_directive_name(node), ":", name, print_directive_expression_or_value(node));
});

function print_directive_name(node: Directive): string {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "AnimateDirective": return "animate";
		case "BindDirective": return "bind";
		case "ClassDirective":return "class";
		case "LetDirective": return "let";
		case "OnDirective": return "on";
		case "StyleDirective": return "style";
		case "TransitionDirective": return "transition";
		case "UseDirective": return "use";
	}
}

function print_directive_expression_or_value(node: Directive): string {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "AnimateDirective":
		case "BindDirective":
		case "ClassDirective":
		case "LetDirective":
		case "OnDirective":
		case "TransitionDirective":
		case "UseDirective": return print_expression(node.expression);
		case "StyleDirective": return print_attribute_like_value(node);
	}
}

function print_expression(expression: Expression | null): string {
	return expression ? insert("={", print(expression).code, "}") : "";
}
