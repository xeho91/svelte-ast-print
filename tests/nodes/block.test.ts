import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("AwaitBlock", () => {
	it("correctly prints standard example", ({ expect }) => {
		const code = `
			{#await promise}
				<p>waiting for the promise to resolve...</p>
			{:then value}
				<p>The value is {value}</p>
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}
		`;
		const node = parse_and_extract_svelte_node<AST.AwaitBlock>(code, "AwaitBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#await promise}
				<p>waiting for the promise to resolve...</p>
			{:then value}
				<p>The value is {value}</p>
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}"
		`);
	});

	it("correctly prints with omitted catch", ({ expect }) => {
		const code = `
			{#await promise}
				<p>waiting for the promise to resolve...</p>
			{:then value}
				<p>The value is {value}</p>
			{/await}
		`;
		const node = parse_and_extract_svelte_node<AST.AwaitBlock>(code, "AwaitBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#await promise}
				<p>waiting for the promise to resolve...</p>
			{:then value}
				<p>The value is {value}</p>
			{/await}"
		`);
	});

	it("correctly prints omitted initial block", ({ expect }) => {
		const code = `
			{#await promise then value}
				<p>The value is {value}</p>
			{/await}
		`;
		const node = parse_and_extract_svelte_node<AST.AwaitBlock>(code, "AwaitBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#await promise then value}
				<p>The value is {value}</p>
			{/await}"
		`);
	});

	it("correctly prints omitted then block", ({ expect }) => {
		const code = `
			{#await promise catch error}
				<p>The error is {error}</p>
			{/await}
		`;
		const node = parse_and_extract_svelte_node<AST.AwaitBlock>(code, "AwaitBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#await promise catch error}
				<p>The error is {error}</p>
			{/await}"
		`);
	});

	it("nested blocks works", ({ expect }) => {
		const code = `
			{#await promiseParent catch error}
				{#await promiseChildren catch error}
					<p>The error is {error}</p>
				{/await}
			{/await}
		`;
		const node = parse_and_extract_svelte_node<AST.AwaitBlock>(code, "AwaitBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#await promiseParent catch error}
				{#await promiseChildren catch error}
					<p>The error is {error}</p>
				{/await}
			{/await}"
		`);
	});
});

describe("EachBlock", () => {
	it("correctly prints simple example", ({ expect }) => {
		const code = `
			{#each items as item}
				<li>{item.name} x {item.qty}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each items as item}
				<li>{item.name} x {item.qty}</li>
			{/each}"
		`);
	});

	it("supports without `as` item ", ({ expect }) => {
		const code = `
			<div class="chess-board">
				{#each { length: 8 }, rank}
					{#each { length: 8 }, file}
						<div class:black={(rank + file) % 2 === 1}></div>
					{/each}
				{/each}
			</div>
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each { length: 8 }, rank}
				{#each { length: 8 }, file}
					<div class:black={(rank + file) % 2 === 1} />
				{/each}
			{/each}"
		`);
	});

	it("correctly prints example with index", ({ expect }) => {
		const code = `
			{#each items as item, i}
				<li>{i + 1}: {item.name} x {item.qty}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each items as item, i}
				<li>{i + 1}: {item.name} x {item.qty}</li>
			{/each}"
		`);
	});

	it("correctly prints example with index and keyed", ({ expect }) => {
		const code = `
			{#each items as item, i (item.id)}
				<li>{i + 1}: {item.name} x {item.qty}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each items as item, i (item.id)}
				<li>{i + 1}: {item.name} x {item.qty}</li>
			{/each}"
		`);
	});

	it("works with destructuring object-like item", ({ expect }) => {
		const code = `
			{#each items as { id, name, qty }, i (id)}
				<li>{i + 1}: {name} x {qty}</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each items as { id, name, qty }, i (id)}
				<li>{i + 1}: {name} x {qty}</li>
			{/each}"
		`);
	});

	it("works with destructuring object-like item with rest pattern", ({ expect }) => {
		const code = `
			{#each objects as { id, ...rest }}
				<li>
					<span>{id}</span>
					<MyComponent {...rest} />
				</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each objects as { id, ...rest }}
				<li>
					<span>{id}</span>
					<MyComponent {...rest} />
				</li>
			{/each}"
		`);
	});

	it("works with destructuring array-like item and with rest pattern", ({ expect }) => {
		const code = `
			{#each items as [id, ...rest]}
				<li>
					<span>{id}</span>
					<MyComponent values={rest} />
				</li>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each items as [id, ...rest]}
				<li>
					<span>{id}</span>
					<MyComponent values={rest} />
				</li>
			{/each}"
		`);
	});

	it("works with else clause for empty lists", ({ expect }) => {
		const code = `
			{#each todos as todo}
				<p>{todo.text}</p>
			{:else}
				<p>No tasks today!</p>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each todos as todo}
				<p>{todo.text}</p>
			{:else}
				<p>No tasks today!</p>
			{/each}"
		`);
	});

	it("nested blocks works", ({ expect }) => {
		const code = `
			{#each todos as todo}
				{#each todo.subtasks as subtask}
					<p>{subtask.test}</p>
				{:else}
					<p>No subtasks available!</p>
				{/each}
			{:else}
				<p>No tasks today!</p>
			{/each}
		`;
		const node = parse_and_extract_svelte_node<AST.EachBlock>(code, "EachBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#each todos as todo}
				{#each todo.subtasks as subtask}
					<p>{subtask.test}</p>
				{:else}
					<p>No subtasks available!</p>
				{/each}
			{:else}
				<p>No tasks today!</p>
			{/each}"
		`);
	});
});

describe("IfBlock", () => {
	it("correctly prints simple {#if} block", ({ expect }) => {
		const code = `
			{#if test}
				<span>simple if</span>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test}
				<span>simple if</span>
			{/if}"
		`);
	});

	it("correctly prints {#if} block with {:else}", ({ expect }) => {
		const code = `
			{#if test}
				<span>if body</span>
			{:else}
				<span>else body</span>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test}
				<span>if body</span>
			{:else}
				<span>else body</span>
			{/if}"
		`);
	});

	it("correctly prints {#if} block with {:else if}", ({ expect }) => {
		const code = `
			{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body</span>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body</span>
			{/if}"
		`);
	});

	it("correctly prints {#if} block with {:else if} and {:else}", ({ expect }) => {
		const code = `
			{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body</span>
			{:else}
				<span>else body</span>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body</span>
			{:else}
				<span>else body</span>
			{/if}"
		`);
	});

	it("correctly prints {#if} block with multiple {:else if} and {:else} - case with element-likes", ({ expect }) => {
		const code = `
			{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body1</span>
			{:else if test3}
				<span>else if body2</span>
			{:else}
				<span>else body</span>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test1}
				<span>if body</span>
			{:else if test2}
				<span>else if body1</span>
			{:else if test3}
				<span>else if body2</span>
			{:else}
				<span>else body</span>
			{/if}"
		`);
	});
	it("correctly prints {#if} block with multiple {:else if} and {:else} - case with text only", ({ expect }) => {
		const code = `
			{#if test1}
				if body
			{:else if test2}
				1else if body
			{:else if test3}
				2else if body
			{:else}
				else body
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.IfBlock>(code, "IfBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#if test1}
				if body
			{:else if test2}
				1else if body
			{:else if test3}
				2else if body
			{:else}
				else body
			{/if}"
		`);
	});
});

describe("KeyBlock", () => {
	it("correctly prints the block where expression tag is used", ({ expect }) => {
		const code = `
			{#key value}
				<div transition:fade>{value}</div>
			{/key}
		`;
		const node1 = parse_and_extract_svelte_node<AST.KeyBlock>(code, "KeyBlock");
		expect(print(node1)).toMatchInlineSnapshot(`
			"{#key value}
				<div transition:fade>{value}</div>
			{/key}"
		`);
	});

	it("correctly prints the block where no key expression is used", ({ expect }) => {
		const code = `
			{#key value}
				<Component />
			{/key}
		`;
		const node = parse_and_extract_svelte_node<AST.KeyBlock>(code, "KeyBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#key value}
				<Component />
			{/key}"
		`);
	});
});

describe("SnippetBlock", () => {
	it("work for a simple template", ({ expect }) => {
		const code = `
			{#snippet hello(name)}
				<p>hello {name}! {message}!</p>
			{/snippet}
		`;
		const node1 = parse_and_extract_svelte_node<AST.SnippetBlock>(code, "SnippetBlock");
		expect(print(node1)).toMatchInlineSnapshot(`
			"{#snippet hello(name)}
				<p>hello {name}! {message}!</p>
			{/snippet}"
		`);
	});

	it("works with deeply nested children", ({ expect }) => {
		const code = `
			{#snippet figure(image)}
				<figure>
					<img
						src={image.src}
						alt={image.caption}
						width={image.width}
						height={image.height}
					/>
					<figcaption>{image.caption}</figcaption>
				</figure>
			{/snippet}
		`;
		const node = parse_and_extract_svelte_node<AST.SnippetBlock>(code, "SnippetBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#snippet figure(image)}
				<figure>
					<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
					<figcaption>{image.caption}</figcaption>
				</figure>
			{/snippet}"
		`);
	});

	it("works with nested snippet", ({ expect }) => {
		const code = `
			{#snippet parent(message)}
				{#snippet children(name)}
					<p>hello {name}! {message}!</p>
				{/snippet}
			{/snippet}
		`;
		const node = parse_and_extract_svelte_node<AST.SnippetBlock>(code, "SnippetBlock");
		expect(print(node)).toMatchInlineSnapshot(`
			"{#snippet parent(message)}
				{#snippet children(name)}
					<p>hello {name}! {message}!</p>
				{/snippet}
			{/snippet}"
		`);
	});
});
