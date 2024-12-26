import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Script", () => {
	it("prints correctly attributes", ({ expect }) => {
		const code = `
			<script context="module" lang="ts">
				export const BUTTON_DEFAULT_VARIANT = "primary";
			</script>

			<script lang="ts">
				export let variant = BUTTON_DEFAULT_VARIANT;
			</script>
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node)).toMatchInlineSnapshot(`
			"<script context="module" lang="ts">
				export const BUTTON_DEFAULT_VARIANT = "primary";
			</script>

			<script lang="ts">
				export let variant = BUTTON_DEFAULT_VARIANT;
			</script>"
		`);
	});

	it("prints correctly advanced content without TypeScript syntax", ({ expect }) => {
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
					console.log(div);
				});

				afterUpdate(() => {
					// ...the DOM is now in sync with the data
					console.log(div);
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
		const node = parse_and_extract_svelte_node<AST.Script>(code, "Script");
		expect(print(node)).toMatchInlineSnapshot(`
			"<script>
				import Eliza from 'elizabot';
				import { beforeUpdate, afterUpdate } from 'svelte';

				let div;

				beforeUpdate(() => {
					// determine whether we should auto-scroll
					// once the DOM is updated...
					console.log(div);
				});

				afterUpdate(() => {
					// ...the DOM is now in sync with the data
					console.log(div);
				});

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
		`);
	});

	it("prints content with TypeScript syntax", ({ expect }) => {
		const code = `
			<script lang="ts">
				let name: string = 'world';

				function greet(name: string) {
					alert(\`Hello, \${name}!\`);
				}
			</script>
		`;
		const node = parse_and_extract_svelte_node<AST.Script>(code, "Script");
		expect(print(node)).toMatchInlineSnapshot(`
			"<script lang="ts">
				let name: string = 'world';

				function greet(name: string) {
					alert(\`Hello, \${name}!\`);
				}
			</script>"
		`);
	});
});
