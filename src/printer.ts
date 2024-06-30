import type { PrintOptions } from "#options";
import type { SupportedSvelteNode } from "#types";

export type Printer<
	TNode extends SupportedSvelteNode = SupportedSvelteNode,
	TOptions extends PrintOptions = PrintOptions,
> = (node: TNode, options: TOptions) => string;

export function define_printer<const TNode extends SupportedSvelteNode, const TOptions extends PrintOptions>(
	fun: Printer<TNode, TOptions>,
): typeof fun {
	return (node: TNode, options: TOptions) => fun(node, options);
}
