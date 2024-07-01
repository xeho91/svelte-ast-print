/**
 * Related to Svelte AST {@link Block} nodes.
 * @see {@link https://svelte.dev/docs/logic-blocks}
 * @module
 */

import { print_await_block } from "#node/block/await";
import { print_each_block } from "#node/block/each";
import { print_if_block } from "#node/block/if";
import { print_key_block } from "#node/block/key";
import { print_snippet_block } from "#node/block/snippet";
import { define_printer } from "#printer";
import type { Block } from "#types";

export const print_block = define_printer((node: Block, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "AwaitBlock": return print_await_block(node, options);
		case "EachBlock": return print_each_block(node, options);
		case "IfBlock": return print_if_block(node, options);
		case "KeyBlock": return print_key_block(node, options);
		case "SnippetBlock": return print_snippet_block(node, options);

	}
});
