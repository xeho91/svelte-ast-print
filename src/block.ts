import "@total-typescript/ts-reset/recommended";

import type { Block, SvelteNode } from "svelte/compiler";

export type SvelteBlock = Block;

// biome-ignore format: Easier to modify
export const SVELTE_BLOCKS = [
	"EachBlock",
	"IfBlock",
	"AwaitBlock",
	"KeyBlock",
	"SnippetBlock",
] as const;

export function is_svelte_block(node: SvelteNode): node is SvelteBlock {
	return SVELTE_BLOCKS.includes(node.type);
}
