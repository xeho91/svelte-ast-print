import dedent from "dedent";
import { parse } from "svelte/compiler";
import { type Context, walk } from "zimmerframe";

import type { SvelteNode } from "#types";

export function parse_svelte_code(code: string): SvelteNode {
	return parse(code, { modern: true }) as SvelteNode;
}

export function extract_svelte_node<TNode extends SvelteNode>(parsed: SvelteNode, name: TNode["type"]): TNode {
	const results: {
		target: TNode | undefined;
	} = {
		target: undefined,
	};

	walk(parsed, results, {
		[name](node: TNode, context: Context<SvelteNode, typeof results>) {
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

export function parse_and_extract_svelte_node<TNode extends SvelteNode>(code: string, name: TNode["type"]): TNode {
	const parsed = parse_svelte_code(dedent(code));
	return extract_svelte_node(parsed, name);
}
