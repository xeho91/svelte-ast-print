import { print as es_print } from "esrap";

import { get_printer } from "#node/mod";
import { type PrintOptions, transform_options } from "#options";
import { type SvelteNode, is_supported_svelte_node } from "#types";

/**
 * Print AST {@link SvelteNode} as string.
 *
 * If:
 * AST node type is unique - comes from Svelte AST - then it will use this package printer.
 *
 * Else:
 * It uses {@link print} to print Estree complaint AST node.
 *
 * @param node - Svelte AST node from {@link parse}
 * @param options_ - printing options
 * @returns Stringified Svelte AST node
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
