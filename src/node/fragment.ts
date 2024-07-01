/**
 * Related to to Svelte AST {@link Fragment} node.
 * @module
 */

import { define_printer } from "#printer";
import type { Fragment } from "#types";

import { get_printer } from "#node/mod";

/**
 * Print Svelte AST node {@link Fragment} as string.
 * FIXME: Parsing TypeScript syntax doesn't work
 */
export const print_fragment = define_printer((node: Fragment, options) => {
	const { nodes } = node;

	return nodes
		.map((n) => {
			// WARN: This is workaround for cyclic dependency
			return get_printer(n)(n, options);
		})
		.join("");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Fragment", () => {
		it("it prints correctly fragment code", ({ expect }) => {
			const code = `
				<h1>Shopping list</h1>
				<ul>
					{#each items as item}
						<li>{item.name} x {item.qty}</li>
					{/each}
				</ul>

				<div class="mb-6">
					<Label for="large-input" class="block mb-2">Large input</Label>
					<Input id="large-input" size="lg" placeholder="Large input" />
				</div>

				{#if porridge.temperature > 100}
					<p>too hot!</p>
				{:else if 80 > porridge.temperature}
					<p>too cold!</p>
				{:else}
					<p>just right!</p>
				{/if}

				{#await promise}
					<!-- promise is pending -->
					<p>waiting for the promise to resolve...</p>
				{:then value}
					<!-- promise was fulfilled or not a Promise -->
					<p>The value is {value}</p>
				{:catch error}
					<!-- promise was rejected -->
					<p>Something went wrong: {error.message}</p>
				{/await}

				{#key value}
					<div transition:fade>{value}</div>
				{/key}
			`;
			const node = parse_and_extract_svelte_node<Fragment>(code, "Fragment");
			expect(print_fragment(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<h1>Shopping list</h1>
				<ul>
					{#each items as item}
						<li>{item.name} x {item.qty}</li>
					{/each}
				</ul>

				<div class="mb-6">
					<Label for="large-input" class="block mb-2">Large input</Label>
					<Input id="large-input" size="lg" placeholder="Large input" />
				</div>

				{#if porridge.temperature > 100}
					<p>too hot!</p>
				{:else if 80 > porridge.temperature}
					<p>too cold!</p>
				{:else}
					<p>just right!</p>
				{/if}

				{#await promise}
					<!-- promise is pending -->
					<p>waiting for the promise to resolve...</p>
				{:then value}
					<!-- promise was fulfilled or not a Promise -->
					<p>The value is {value}</p>
				{:catch error}
					<!-- promise was rejected -->
					<p>Something went wrong: {error.message}</p>
				{/await}

				{#key value}
					<div transition:fade>{value}</div>
				{/key}"
			`,
			);
		});

		it.fails("it prints correctly fragment code with typescript syntax", ({ expect }) => {
			const code = `
				{#snippet template({ children, ...args }: Args<typeof Story>, context: StoryContext<typeof Story>)}
				<Button {...args}>{children}</Button>
				{/snippet}
			`;
			const node = parse_and_extract_svelte_node<Fragment>(code, "Fragment");
			expect(print_fragment(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot();
		});
	});
}
