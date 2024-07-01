/**
 * Related to Svelte AST {@link Directive} nodes.
 * @module
 */

import { print_animate_directive } from "#node/attribute-like/directive/animation";
import { print_bind_directive } from "#node/attribute-like/directive/bind";
import { print_class_directive } from "#node/attribute-like/directive/class";
import { print_let_directive } from "#node/attribute-like/directive/let";
import { print_on_directive } from "#node/attribute-like/directive/on";
import { print_style_directive } from "#node/attribute-like/directive/style";
import { print_transition_directive } from "#node/attribute-like/directive/transition";
import { print_use_directive } from "#node/attribute-like/directive/use";
import { define_printer } from "#printer";
import type { Directive } from "#types";

/**
 * Print Svelte AST node {@link Directive} as string.
 *
 * @see {@link https://svelte.dev/docs/component-directives}
 * @see {@link https://svelte.dev/docs/element-directives}
 */
export const print_directive = define_printer((node: Directive, options) => {
	const { type } = node;

	// biome-ignore format: Prettier
	switch (type) {
		case "AnimateDirective": return print_animate_directive(node, options);
		case "BindDirective": return print_bind_directive(node, options);
		case "ClassDirective": return print_class_directive(node, options);
		case "LetDirective": return print_let_directive(node, options);
		case "OnDirective": return print_on_directive(node, options);
		case "StyleDirective": return print_style_directive(node, options);
		case "TransitionDirective": return print_transition_directive(node, options);
		case "UseDirective": return print_use_directive(node, options);
	}
});
