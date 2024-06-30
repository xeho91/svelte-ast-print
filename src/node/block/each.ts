/**
 * Related to Svelte AST node {@link EachBlock}.
 * @see {@link https://svelte.dev/docs/logic-blocks#each}
 * @module
 */

import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { EachBlock } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link EachBlock} as string.
 * @see {@link https://svelte.dev/docs/logic-blocks#each}
 *
 * @example simple
 * ```svelte
 * {#each expression as name}...{/each}
 * ```
 *
 * @example with index
 * ```svelte
 * {#each expression as name, index}...{/each}
 * ```
 *
 * @example keyed
 * ```svelte
 * {#each expression as name (key)}...{/each}
 * ```
 *
 * @example with index and keyed
 * ```svelte
 * {#each expression as name, index (key)}...{/each}
 * ```
 *
 * @example with else clause for when list is empty
 * ```svelte
 * {#each expression as name}...{:else}...{/each}
 * ```
 */
export const print_each_block = define_printer((node: EachBlock, options) => {
	const { body, context, expression, fallback, index, key } = node;

	return insert(
		insert(
			"{#each",
			" ",
			print(expression).code,
			" as ",
			print(context).code,
			index && `, ${index}`,
			key && insert(" (", print(key).code, ")"),
			"}",
		),
		print_fragment(body, options),
		fallback && insert("{:else}", print_fragment(fallback, options)),
		"{/each}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("EachBlock", () => {
		it("correctly prints simple example", ({ expect }) => {
			const code = `
				{#each items as item}
					<li>{item.name} x {item.qty}</li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#each items as item}
					<li>{item.name} x {item.qty}</li>
				{/each}"
			`);
		});

		it("correctly prints example with index", ({ expect }) => {
			const code = `
				{#each items as item, i}
					<li>{i + 1}: {item.name} x {item.qty}</li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#each items as { id, name, qty }, i (id)}
					<li>{i + 1}: {name} x {qty}</li>
				{/each}"
			`);
		});

		it("works with destructuring object-like item with rest pattern", ({ expect }) => {
			const code = `
				{#each objects as { id, ...rest }}
					<li><span>{id}</span><MyComponent {...rest} /></li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#each objects as { id, ...rest }}
					<li><span>{id}</span><MyComponent {...rest} /></li>
				{/each}"
			`);
		});

		it("works with destructuring array-like item and with rest pattern", ({ expect }) => {
			const code = `
				{#each items as [id, ...rest]}
					<li><span>{id}</span><MyComponent values={rest} /></li>
				{/each}
			`;
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#each items as [id, ...rest]}
					<li><span>{id}</span><MyComponent values={rest} /></li>
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
			const node = parse_and_extract_svelte_node<EachBlock>(code, "EachBlock");
			expect(print_each_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#each todos as todo}
					<p>{todo.text}</p>
				{:else}
					<p>No tasks today!</p>
				{/each}"
			`);
		});
	});
}
