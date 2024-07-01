import { print } from "esrap";

import type { Attribute, StyleDirective } from "#types";
import { insert } from "#util";

interface Options {
	skip_assignment?: boolean;
}

export function print_attribute_like_value(node: Attribute | StyleDirective, options: Options = {}): string {
	const { value } = node;
	const { skip_assignment = false } = options;

	// NOTE: This is e.g. `<button disabled />`
	if (value === true) return "";

	// WARN: I can't find a case where it can be an array?
	// This may be a problem in the future
	if (value[0]?.type === "Text") {
		return insert('="', value[0].raw, '"');
	}

	if (value[0]?.type === "ExpressionTag") {
		return insert(!skip_assignment && "=", "{", print(value[0].expression).code, "}");
	}

	throw Error(`Reached unexpected case in print_attribute_like_value of ${node.type}`);
}
