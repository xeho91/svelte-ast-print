import { print as es_print } from "esrap";

import { get_printer } from "#node/mod";
import { transform_options, type PrintOptions } from "#options";
import { is_supported_svelte_node, type SupportedSvelteNode, type SvelteNode } from "#types";

/**
 * Print a {@link SvelteNode} Svelte AST node as stringified version.
 * If:
 * AST Node type is unique, that comes from Svelte AST - defined as {@link SupportedSvelteNode} - then it will use
 * our printer.
 * Else:
 * It uses {@link print} to print Estree complaint AST node.
 *
 * @param node - Svelte AST node from {@link parse}
 * @param options_ - printing options
 * @returns Stringified Svelte AST node.
 */
export function print<const TNode extends SvelteNode, const TOptions extends Partial<PrintOptions>>(
	node: TNode,
	options_ = {} as TOptions,
): string {
	if (is_supported_svelte_node(node)) {
		const options = transform_options(options_);
		const printer = get_printer(node);
		return printer(node, options);
	}

	return es_print(node).code;
}

print(
	{
		type: "IfBlock",
		test: {
			type: "Literal",
			value: "lol",
		},
		consequent: {
			type: "Fragment",
			nodes: [],
			transparent: false,
		},
		elseif: false,
		alternate: null,
	},
	{
		format: {
			indent: "tab",
		},
	},
);
