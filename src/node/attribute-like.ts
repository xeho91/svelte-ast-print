import { print } from "esrap";

import type { Expression } from "estree";
import { define_printer } from "#printer";
import type { Attribute, Directive, SpreadAttribute, StyleDirective } from "#types";

const print_attribute = define_printer((node: Attribute, _options) => {
	const { name } = node;
	return `${name}${print_attribute_like_value(node)}`;
});

const print_spread_attribute = define_printer((node: SpreadAttribute, _options) => {
	const { expression } = node;
	return `{...${print(expression).code}}`;
});

const print_directive = define_printer((node: Directive, _options) => {
	const { name } = node;

	return `${print_directive_name(node)}:${name}${print_directive_expression_or_value(node)}`;
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

function print_attribute_like_value(node: Attribute | StyleDirective): string {
	const { value } = node;
	if (value === true) return "";
	// TODO: How the hell it can be an array?
	if (value[0]?.type === "Text") {
		return `="${value[0].raw}"`;
	}
	if (value[0]?.type === "ExpressionTag") {
		return `={${print(value[0].expression).code}}`;
	}
	throw Error(`Reached unexpected case in print_attribute_like_value of ${node.type}`);
}

function print_expression(expression: Expression | null): string {
	return expression ? `={${print(expression).code}}` : "";
}

export const print_attribute_like = define_printer((node: Attribute | SpreadAttribute | Directive, options) => {
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

export function print_attributes_like(
	attributes: Array<Parameters<typeof print_attribute_like>[0]>,
	options: Parameters<typeof print_attribute_like>[1],
): string {
	if (attributes.length === 0) return "";
	const stringified = attributes.map((a) => print_attribute_like(a, options)).join(" ");
	return ` ${stringified}`;
}
