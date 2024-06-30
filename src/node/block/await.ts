/**
 * Related to Svelte AST node {@link AwaitBlock}.
 * @see {@link https://svelte.dev/docs/logic-blocks#await}
 * @module
 */

import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { AwaitBlock } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link AwaitBlock} as string.
 * @see {@link https://svelte.dev/docs/logic-blocks#await}
 *
 * @example standard
 * ```svelte
 * {#await expression}...{:then name}...{:catch name}...{/await}
 * ```
 *
 * @example without catch
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example without pending body
 * ```svelte
 * {#await expression then name}...{/await}
 * ```
 *
 * @example with catch body only
 * ```svelte
 * https://svelte.dev/docs/logic-blocks#await
 * ```
 */
export const print_await_block = define_printer((node: AwaitBlock, options) => {
	const { catch: catch_, error, expression, pending, then, value } = node;

	return insert(
		"{#await ",
		print(expression).code,
		insert(
			then && !pending && insert(" then", value && insert(" ", print(value).code)),
			catch_ && !pending && insert(" catch", error && insert(" ", print(error).code)),
		),
		"}",
		pending && print_fragment(pending, options),
		then &&
			insert(
				pending && insert("{:then", value && insert(" ", print(value).code), "}"),
				print_fragment(then, options),
			),
		catch_ &&
			insert(
				pending && insert("{:catch", error && insert(" ", print(error).code), "}"),
				print_fragment(catch_, options),
			),
		"{/await}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

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
			const node = parse_and_extract_svelte_node<AwaitBlock>(code, "AwaitBlock");
			expect(print_await_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<AwaitBlock>(code, "AwaitBlock");
			expect(print_await_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<AwaitBlock>(code, "AwaitBlock");
			expect(print_await_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<AwaitBlock>(code, "AwaitBlock");
			expect(print_await_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#await promise catch error}
					<p>The error is {error}</p>
				{/await}"
			`);
		});
	});
}
