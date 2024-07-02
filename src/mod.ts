import { print as es_print } from "esrap";
import type { parse } from "svelte/compiler";

import { get_printer } from "#node/mod";
import { type PrintOptions, transform_options } from "#options";
import { type SvelteNode, is_supported_svelte_node } from "#types";

/**
 * Print AST {@link SvelteNode} as a string.
 * Aka parse in reverse.
 *
 * ## How does it work under the hood?
 *
 * **IF**: the AST node is Svelte node {@link SvelteNode},
 * e.g. created from [Svelte parser](https://svelte.dev/docs/svelte-compiler#parse) - {@link parse}\
 * **THEN:** it uses the printer(s) from this package.
 *
 * **ELSE**: the provided AST Node is [Estree compliant](https://github.com/estree/estree), e.g. from `acorn`\
 * **THEN:** it uses `esrap` package {@link print} function.
 *
 *
 * @param node - Svelte AST node
 * @param options - printing options
 * @returns Stringified Svelte AST node
 */
export function print<const TNode extends SvelteNode, const TOptions extends Partial<PrintOptions>>(
	node: TNode,
	options = {} as TOptions,
): string {
	if (is_supported_svelte_node(node)) {
		const options_ = transform_options(options);
		const printer = get_printer(node);
		return printer(node, options_);
	}

	return es_print(node).code;
}
