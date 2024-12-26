import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Root", () => {
	it("it prints correctly Svelte code without TypeScript syntax", ({ expect }) => {
		const code = `
			<script context="module">
				export const FOO = "BAR";
			</script>

			<script>
				let todos = [
					{ done: false, text: 'finish Svelte tutorial' },
					{ done: false, text: 'build an app' },
					{ done: false, text: 'world domination' }
				];

				function add() {
					todos = todos.concat({
						done: false,
						text: ''
					});
				}

				function clear() {
					todos = todos.filter((t) => !t.done);
				}

				$: remaining = todos.filter((t) => !t.done).length;
			</script>

			<div class="centered">
				<h1>todos</h1>
				<ul class="todos">
					{#each todos as todo}
						<li class:done={todo.done}>
							<input
								type="checkbox"
								checked={todo.done}
							/>
							<input
								type="text"
								placeholder="What needs to be done?"
								value={todo.text}
							/>
						</li>
					{/each}
				</ul>
				<p>{remaining} remaining</p>
				<button on:click={add}>
					Add new
				</button>
				<button on:click={clear}>
					Clear completed
				</button>
			</div>
			<style>
				.centered {
					max-width: 20em;
					margin: 0 auto;
				}
				.done {
					opacity: 0.4;
				}
				li {
					display: flex;
				}
				input[type="text"] {
					flex: 1;
					padding: 0.5em;
					margin: -0.2em 0;
					border: none;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node)).toMatchInlineSnapshot(
			`
			"<script context="module">
				export const FOO = "BAR";
			</script>

			<script>
				let todos = [
					{ done: false, text: 'finish Svelte tutorial' },
					{ done: false, text: 'build an app' },
					{ done: false, text: 'world domination' }
				];

				function add() {
					todos = todos.concat({ done: false, text: '' });
				}

				function clear() {
					todos = todos.filter((t) => !t.done);
				}

				$: remaining = todos.filter((t) => !t.done).length;
			</script>

			<div class="centered">
				<h1>todos</h1>
				<ul class="todos">
					{#each todos as todo}
						<li class:done={todo.done}>
							<input type="checkbox" checked={todo.done} />
							<input type="text" placeholder="What needs to be done?" value={todo.text} />
						</li>
					{/each}
				</ul>
				<p>{remaining} remaining</p>
				<button on:click={add}>
					Add new
				</button>
				<button on:click={clear}>
					Clear completed
				</button>
			</div>

			<style>
				.centered {
					max-width: 20em;
					margin: 0 auto;
				}

				.done {
					opacity: 0.4;
				}

				li {
					display: flex;
				}

				input[type="text"] {
					flex: 1;
					padding: 0.5em;
					margin: -0.2em 0;
					border: none;
				}
			</style>"
		`,
		);
	});

	it("it prints correctly Svelte code with TypeScript syntax", ({ expect }) => {
		const code = `
			<script context="module" lang="ts">
				import {
					defineMeta,
					setTemplate,
					type Args,
					type StoryContext,
				} from '@storybook/addon-svelte-csf';
				import { fn } from '@storybook/test';

				import Button from './components/Button.svelte';

				const onclickFn = fn().mockName('onclick');

				/**
				* These are the stories for the \`Button\` component.
				* It's the default button we use throughout our application.
				*/
				const { Story } = defineMeta({
					component: Button,
					tags: ['autodocs'],
					args: {
						children: 'Click me',
						onclick: onclickFn,
					},
					argTypes: {
						backgroundColor: { control: 'color' },
						size: {
							control: { type: 'select' },
							options: ['small', 'medium', 'large'],
						},
						children: { control: 'text' },
					},
				});
			</script>

			<script lang="ts">
				setTemplate(template);
			</script>

			{#snippet template({ children, ...args }: Args<typeof Story>, context: StoryContext<typeof Story>)}
				<Button {...args}>{children}</Button>
			{/snippet}

			<!-- Only use this sparingly as the main CTA. -->
			<Story name="Primary" args={{ primary: true }} />

			<Story name="Secondary" />

			<Story name="Large" args={{ size: 'large' }} />

			<!-- This is _tiny_ 🤏 -->
			<Story name="Small" args={{ size: 'small' }} />

			<Story name="Long content">
				<Button onclick={onclickFn}>The very long content</Button>
			</Story>
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node)).toMatchInlineSnapshot(
			`
			"<script context="module" lang="ts">
				import {
					defineMeta,
					setTemplate,
					type Args,
					type StoryContext
				} from '@storybook/addon-svelte-csf';

				import { fn } from '@storybook/test';
				import Button from './components/Button.svelte';

				const onclickFn = fn().mockName('onclick');

				/**
				* These are the stories for the \`Button\` component.
				* It's the default button we use throughout our application.
				*/
				const { Story } = defineMeta({
					component: Button,
					tags: ['autodocs'],
					args: { children: 'Click me', onclick: onclickFn },
					argTypes: {
						backgroundColor: { control: 'color' },
						size: {
							control: { type: 'select' },
							options: ['small', 'medium', 'large']
						},
						children: { control: 'text' }
					}
				});
			</script>

			<script lang="ts">
				setTemplate(template);
			</script>

			{#snippet template({ children, ...args }: Args<typeof Story>, context: StoryContext<typeof Story>)}
				<Button {...args}>{children}</Button>
			{/snippet}
			<!-- Only use this sparingly as the main CTA. -->
			<Story name="Primary" args={{ primary: true }} />
			<Story name="Secondary" />
			<Story name="Large" args={{ size: 'large' }} />
			<!-- This is _tiny_ 🤏 -->
			<Story name="Small" args={{ size: 'small' }} />
			<Story name="Long content">
				<Button onclick={onclickFn}>The very long content</Button>
			</Story>"
		`,
		);
	});

	it("prints correctly an legacy example from Storybook", ({ expect }) => {
		const code = `
			<script context="module">
				import { defineMeta } from "@storybook/addon-svelte-csf";

				/** This is a description for the **Button** component stories. */
				const { Story } = defineMeta({ title: "Atoms/Button", component: Button });
			</script>

			<!-- This is a description for the **Button** component stories. -->
			<Meta title="Atoms/Button" component={Button} />

			<Template let:args>
				<Button {...args} />
			</Template>

			<Story name="Default" />
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node)).toMatchInlineSnapshot(`
			"<script context="module">
				import { defineMeta } from "@storybook/addon-svelte-csf";

				/** This is a description for the **Button** component stories. */
				const { Story } = defineMeta({ title: "Atoms/Button", component: Button });
			</script>

			<!-- This is a description for the **Button** component stories. -->
			<Meta title="Atoms/Button" component={Button} />
			<Template let:args>
				<Button {...args} />
			</Template>
			<Story name="Default" />"
		`);
	});

	it("template literals indentation is left untouched", ({ expect }) => {
		const code = `
			<script>
				const text = \`
I am just a story.
Hello world.
How are you?

I am good.
			\`;
			console.log(text);
			</script>

			hello world
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node)).toMatchInlineSnapshot(`
			"<script>
				const text = \`
			I am just a story.
			Hello world.
			How are you?

			I am good.
			\`;

				console.log(text);
			</script>

			hello world"
		`);
	});
});
