import dedent from "dedent";
import { parse } from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

import type { SupportedSvelteNode } from "#types";

export function parse_svelte_code(code: string): SupportedSvelteNode {
	return parse(code, { modern: true }) as SupportedSvelteNode;
}

export function extract_svelte_node<TNode extends SupportedSvelteNode>(
	parsed: SupportedSvelteNode,
	name: TNode["type"],
): TNode {
	const results: {
		target: TNode | undefined;
	} = {
		target: undefined,
	};

	walk(parsed, results, {
		[name](node: TNode, context: Context<SupportedSvelteNode, typeof results>) {
			const { state, stop } = context;
			state.target = node;
			stop();
		},
	});

	if (!results.target) {
		throw new Error(`Could not find the in the parsed Svelte AST a target node: ${name}`);
	}

	return results.target;
}

export function parse_and_extract_svelte_node<TNode extends SupportedSvelteNode>(
	code: string,
	name: TNode["type"],
): TNode {
	const parsed = parse_svelte_code(dedent(code));
	return extract_svelte_node(parsed, name);
}
