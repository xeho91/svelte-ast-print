import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("ConstTag", () => {
	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
		const code = `
			{#each boxes as box}
				{@const area = box.width * box.height}
				{box.width} * {box.height} = {area}
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.ConstTag>(code, "ConstTag");
		expect(print(node)).toMatchInlineSnapshot(`"{@const area = box.width * box.height}"`);
	});
});

describe("DebugTag", () => {
	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
		const code = `
			<script>
				let user = {
					firstname: 'Ada',
					lastname: 'Lovelace'
				};
			</script>

			{@debug user}

			<h1>Hello {user.firstname}!</h1>
		`;
		const node = parse_and_extract_svelte_node<AST.DebugTag>(code, "DebugTag");
		expect(print(node)).toMatchInlineSnapshot(`"{@debug user}"`);
	});
});

describe("ExpressionTag", () => {
	it("correctly prints an reactive and simple Svelte expression in template", ({ expect }) => {
		const code = "{name}";
		const node = parse_and_extract_svelte_node<AST.ExpressionTag>(code, "ExpressionTag");
		expect(print(node)).toMatchInlineSnapshot(`"{name}"`);
	});

	it("supports dot notation", ({ expect }) => {
		const code = "{svelte.is.the.best.framework}";
		const node = parse_and_extract_svelte_node<AST.ExpressionTag>(code, "ExpressionTag");
		expect(print(node)).toMatchInlineSnapshot(`"{svelte.is.the.best.framework}"`);
	});

	it("supports brackets notation and question mark", ({ expect }) => {
		const code = "{svelte[5].release?.date}";
		const node = parse_and_extract_svelte_node<AST.ExpressionTag>(code, "ExpressionTag");
		expect(print(node)).toMatchInlineSnapshot(`"{svelte[5].release?.date}"`);
	});
});

describe("HtmlTag", () => {
	it("prints correctly when used in an example case", ({ expect }) => {
		const code = `
				<div class="blog-post">
					<h1>{post.title}</h1>
					{@html post.content}
				</div>
			`;
		const node = parse_and_extract_svelte_node<AST.HtmlTag>(code, "HtmlTag");
		expect(print(node)).toMatchInlineSnapshot(`"{@html post.content}"`);
	});
});

describe("RenderTag", () => {
	it("prints correctly when used in an example case", ({ expect }) => {
		const code = `
			{#snippet hello(name)}
				<p>hello {name}! {message}!</p>
			{/snippet}

			{@render hello('alice')}
		`;
		const node = parse_and_extract_svelte_node<AST.RenderTag>(code, "RenderTag");
		expect(print(node)).toMatchInlineSnapshot(`"{@render hello('alice')}"`);
	});
});
