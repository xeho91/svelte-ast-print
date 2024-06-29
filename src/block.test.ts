import { parse, type SvelteNode } from "svelte/compiler";
import { describe, it } from "vitest";
import { walk } from "zimmerframe";

import { is_svelte_block } from "#block";

const EXAMPLE = `
<div>
	{#if true}
		<span>example</span>
	{/if}
</div>
`;

const parsed = parse(EXAMPLE, { modern: true });

describe(is_svelte_block.name, () => {
	console.log({ parsed, fragment: parsed.fragment });
	it("returns 'true' for random svelte blocks", ({ expect }) => {
		walk(
			parsed as SvelteNode,
			{},
			{
				IfBlock(node) {
					console.log("IfBlock", { node, consequent: node.consequent.nodes });
					expect(is_svelte_block(node)).toBe(true);
				},
			},
		);
	});
});
