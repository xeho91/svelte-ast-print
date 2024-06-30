/**
 * Related to Svelte AST node {@link SnippetBlock}.
 * TODO: Update link to the official doc once Svelte v5 is released
 * @see {@link https://svelte-5-preview.vercel.app/docs/snippets}
 * @module
 */

import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { SnippetBlock } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link SnippetBlock} as string.
 * TODO: Update link to the official doc once Svelte v5 is released
 * @see {@link https://svelte-5-preview.vercel.app/docs/snippets}
 *
 * @example pattern
 * ```svelte
 * {#snippet expression(parameters)}...{/snippet}
 * ```
 */
export const print_snippet_block = define_printer((node: SnippetBlock, options) => {
	const { body, expression, parameters } = node;

	return insert(
		//
		"{#snippet ",
		print(expression).code,
		"(",
		parameters.map((p) => print(p).code).join(", "),
		")",
		"}",
		print_fragment(body, options),
		"{/snippet}",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("SnippetBlock", () => {
		it("work for a simple template", ({ expect }) => {
			const code = `
				{#snippet hello(name)}
					<p>hello {name}! {message}!</p>
				{/snippet}
			`;
			const node1 = parse_and_extract_svelte_node<SnippetBlock>(code, "SnippetBlock");
			expect(print_snippet_block(node1, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
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
			const node = parse_and_extract_svelte_node<SnippetBlock>(code, "SnippetBlock");
			expect(print_snippet_block(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"{#snippet figure(image)}
					<figure>
						<img src={image.src} alt={image.caption} width={image.width} height={image.height} />
						<figcaption>{image.caption}</figcaption>
					</figure>
				{/snippet}"
			`);
		});
	});
}
