import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("AnimateDirective", () => {
	it("works on without params variant", ({ expect }) => {
		const code = `
			{#each list as item, index (item)}
				<li animate:flip>{item}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.AnimateDirective>(code, "AnimateDirective");
		expect(print(node)).toMatchInlineSnapshot(`"animate:flip"`);
	});

	it("works on with params variant", ({ expect }) => {
		const code = `
			{#each list as item, index (item)}
				<li animate:flip={{ delay: 500 }}>{item}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.AnimateDirective>(code, "AnimateDirective");
		expect(print(node)).toMatchInlineSnapshot(`"animate:flip={{ delay: 500 }}"`);
	});
});

describe("BindDirective", () => {
	it("prints correctly when is a shorthand", ({ expect }) => {
		const code = `
			<script lang="ts">
				let value: string;
			</script>

			<input type="text" bind:value />
		`;
		const node = parse_and_extract_svelte_node<AST.BindDirective>(code, "BindDirective");
		expect(print(node)).toMatchInlineSnapshot(`"bind:value"`);
	});

	it("works on binding input value", ({ expect }) => {
		const code = `
			<input bind:value={name} />
		`;
		const node = parse_and_extract_svelte_node<AST.BindDirective>(code, "BindDirective");
		expect(print(node)).toMatchInlineSnapshot(`"bind:value={name}"`);
	});

	it("works on binding input checked", ({ expect }) => {
		const code = `
			<input type="checkbox" bind:checked={yes} />
		`;
		const node = parse_and_extract_svelte_node<AST.BindDirective>(code, "BindDirective");
		expect(print(node)).toMatchInlineSnapshot(`"bind:checked={yes}"`);
	});
});

describe("ClassDirective", () => {
	it("works with value", ({ expect }) => {
		const code = `
			<div class:active={isActive}>...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.ClassDirective>(code, "ClassDirective");
		expect(print(node)).toMatchInlineSnapshot(`"class:active={isActive}"`);
	});

	it("works without value - shorthand", ({ expect }) => {
		const code = `
			<div class:active>...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.ClassDirective>(code, "ClassDirective");
		expect(print(node)).toMatchInlineSnapshot(`"class:active"`);
	});
});

describe("LetDirective", () => {
	it("works on with value", ({ expect }) => {
		const code = `
			<FancyList {items} let:prop={thing}>
				<div>{thing.text}</div>
			</FancyList>
		`;
		const node = parse_and_extract_svelte_node<AST.LetDirective>(code, "LetDirective");
		expect(print(node)).toMatchInlineSnapshot(`"let:prop={thing}"`);
	});

	it("works on without value", ({ expect }) => {
		const code = `
			<Story let:args>
				<Button {...args} />
			</Story>
		`;
		const node = parse_and_extract_svelte_node<AST.LetDirective>(code, "LetDirective");
		expect(print(node)).toMatchInlineSnapshot(`"let:args"`);
	});
});

describe("OnDirective", () => {
	it("works on without modifiers variant", ({ expect }) => {
		const code = `
			<button on:click={() => (count += 1)}>
				count: {count}
			</button>
		`;
		const node = parse_and_extract_svelte_node<AST.OnDirective>(code, "OnDirective");
		expect(print(node)).toMatchInlineSnapshot(`"on:click={() => count += 1}"`);
	});

	it("works on with modifiers variant", ({ expect }) => {
		const code = `
			<form on:submit|preventDefault={handleSubmit}>
				...
			</form>
		`;
		const node = parse_and_extract_svelte_node<AST.OnDirective>(code, "OnDirective");
		expect(print(node)).toMatchInlineSnapshot(`"on:submit|preventDefault={handleSubmit}"`);
	});
});

describe("StyleDirective", () => {
	it("works with expression tag value", ({ expect }) => {
		const code = `
			<div style:color={myColor}>...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.StyleDirective>(code, "StyleDirective");
		expect(print(node)).toMatchInlineSnapshot(`"style:color={myColor}"`);
	});

	it("works with shorthand", ({ expect }) => {
		const code = `
			<div style:color>...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.StyleDirective>(code, "StyleDirective");
		expect(print(node)).toMatchInlineSnapshot(`"style:color"`);
	});

	it("works with text expression", ({ expect }) => {
		const code = `
			<div style:color="red">...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.StyleDirective>(code, "StyleDirective");
		expect(print(node)).toMatchInlineSnapshot(`"style:color="red""`);
	});

	it("works with modifiers and text expression", ({ expect }) => {
		const code = `
			<div style:color|important="red">...</div>
		`;
		const node = parse_and_extract_svelte_node<AST.StyleDirective>(code, "StyleDirective");
		expect(print(node)).toMatchInlineSnapshot(`"style:color|important="red""`);
	});
});

describe("TransitionDirective", () => {
	it("works when using transition", ({ expect }) => {
		const code = `
			{#if visible}
				<div transition:scale>scales in, scales out</div>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"transition:scale"`);
	});

	it("works when using intro", ({ expect }) => {
		const code = `
			{#if visible}
				<div in:fly>flies in</div>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"in:fly"`);
	});

	it("works when using outro", ({ expect }) => {
		const code = `
			{#if visible}
				<div out:fade>fades out</div>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"out:fade"`);
	});

	it("works when using params", ({ expect }) => {
		const code = `
			{#if visible}
				<p transition:fly={{ y: 200, duration: 2000 }}>
					Flies in and out
				</p>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"transition:fly={{ y: 200, duration: 2000 }}"`);
	});

	it("works when using modifiers", ({ expect }) => {
		const code = `
			{#if visible}
				<p transition:fade|global>fades in and out when x or y change</p>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"transition:fade|global"`);
	});

	it("works when using modifiers and with params", ({ expect }) => {
		const code = `
			{#if visible}
				<p transition:fade|local={{ y: 200, duration: 2000 }}>fades in and out when x or y change</p>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.TransitionDirective>(code, "TransitionDirective");
		expect(print(node)).toMatchInlineSnapshot(`"transition:fade|local={{ y: 200, duration: 2000 }}"`);
	});
});

describe("UseDirective", () => {
	it("works with parameters", ({ expect }) => {
		const code = `
			<div use:foo={bar} />
		`;
		const node = parse_and_extract_svelte_node<AST.UseDirective>(code, "UseDirective");
		expect(print(node)).toMatchInlineSnapshot(`"use:foo={bar}"`);
	});

	it("works on without parameters - shorthand", ({ expect }) => {
		const code = `
			<div use:foo />
		`;
		const node = parse_and_extract_svelte_node<AST.UseDirective>(code, "UseDirective");
		expect(print(node)).toMatchInlineSnapshot(`"use:foo"`);
	});
});
