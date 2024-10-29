import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Comment", () => {
	it("prints correctly a single line comment from random code", ({ expect }) => {
		const code = `
			{#each boxes as box}
				<!-- This is a single line comment -->
				{@const area = box.width * box.height}
				{box.width} * {box.height} = {area}
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.Comment>(code, "Comment");
		expect(print(node)).toMatchInlineSnapshot(`"<!-- This is a single line comment -->"`);
	});

	it("supports multiple line comment", ({ expect }) => {
		const code = `
			<!--
				This
				is
				multiple
				line
				comment
			-->
		`;
		const node = parse_and_extract_svelte_node<AST.Comment>(code, "Comment");
		expect(print(node)).toMatchInlineSnapshot(
			`
			"<!--
				This
				is
				multiple
				line
				comment
			-->"
		`,
		);
	});
});

describe("Text", () => {
	it("prints correctly a random text comment from random code", ({ expect }) => {
		const code = `
			<span>Catch me if you can</span>
		`;
		const node = parse_and_extract_svelte_node<AST.Text>(code, "Text");
		expect(print(node)).toMatchInlineSnapshot(`"Catch me if you can"`);
	});
});
