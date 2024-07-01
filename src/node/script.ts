/**
 * Related to to Svelte AST {@link Script} node.
 * @see {@link https://svelte.dev/docs/svelte-components#script}
 * @see {@link https://svelte.dev/docs/svelte-components#script-context-module}
 * @module
 */

import { print } from "esrap";

import { print_attributes } from "#node/attribute-like/mod";
import { define_printer } from "#printer";
import type { Script } from "#types";
import { NEW_LINE, insert } from "#util";

/**
 * Print Svelte AST node {@link Script} as string.
 *
 * @see {@link https://svelte.dev/docs/svelte-components#script}
 * @see {@link https://svelte.dev/docs/svelte-components#script-context-module}
 */
export const print_script = define_printer((node: Script, options) => {
	const { attributes, content } = node;

	return insert(
		//
		"<script",
		// context && ` context="${context}"`,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		">",
		NEW_LINE,
		print(content).code,
		NEW_LINE,
		"</script>",
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Script", () => {
		it("it prints correctly attributes", ({ expect }) => {
			const code = `
				<script context="module" lang="ts">
				</script>
			`;
			const node = parse_and_extract_svelte_node<Script>(code, "Script");
			expect(print_script(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<script context="module" lang="ts">

				</script>"
			`,
			);
		});

		it("it prints correctly non-ts content", ({ expect }) => {
			const code = `
				<script>
					import Eliza from 'elizabot';
					import {
						beforeUpdate,
						afterUpdate
					} from 'svelte';

					let div;

					beforeUpdate(() => {
						// determine whether we should auto-scroll
						// once the DOM is updated...
					});

					afterUpdate(() => {
						// ...the DOM is now in sync with the data
					});

					const eliza = new Eliza();
					const pause = (ms) => new Promise((fulfil) => setTimeout(fulfil, ms));

					const typing = { author: 'eliza', text: '...' };

					let comments = [];

					async function handleKeydown(event) {
						if (event.key === 'Enter' && event.target.value) {
							const comment = {
								author: 'user',
								text: event.target.value
							};

							const reply = {
								author: 'eliza',
								text: eliza.transform(comment.text)
							};

							event.target.value = '';
							comments = [...comments, comment];

							await pause(200 * (1 + Math.random()));
							comments = [...comments, typing];

							await pause(500 * (1 + Math.random()));
							comments = [...comments, reply].filter(comment => comment !== typing);
						}
					}
				</script>
			`;
			const node = parse_and_extract_svelte_node<Script>(code, "Script");
			expect(print_script(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<script>
				import Eliza from 'elizabot';
				import { beforeUpdate, afterUpdate } from 'svelte';

				let div;

				beforeUpdate(() => {}); // determine whether we should auto-scroll
				// once the DOM is updated...
				afterUpdate(() => {}); // ...the DOM is now in sync with the data

				const eliza = new Eliza();
				const pause = (ms) => new Promise((fulfil) => setTimeout(fulfil, ms));
				const typing = { author: 'eliza', text: '...' };
				let comments = [];

				async function handleKeydown(event) {
					if (event.key === 'Enter' && event.target.value) {
						const comment = { author: 'user', text: event.target.value };

						const reply = {
							author: 'eliza',
							text: eliza.transform(comment.text)
						};

						event.target.value = '';
						comments = [...comments, comment];
						await pause(200 * (1 + Math.random()));
						comments = [...comments, typing];
						await pause(500 * (1 + Math.random()));
						comments = [...comments, reply].filter((comment) => comment !== typing);
					}
				}
				</script>"
			`,
			);
		});

		it("it prints correctly ts content", ({ expect }) => {
			const code = `
				<script lang="ts">
					let name: string = 'world';

					function greet(name: string) {
						alert(\`Hello, \${name}!\`);
					}
				</script>
			`;
			const node = parse_and_extract_svelte_node<Script>(code, "Script");
			expect(print_script(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<script lang="ts">
				let name = 'world';

				function greet(name) {
					alert(\`Hello, \${name}!\`);
				}
				</script>"
			`,
			);
		});
	});
}
