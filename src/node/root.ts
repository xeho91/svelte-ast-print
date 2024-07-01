/**
 * Related to to Svelte AST {@link Root} node.
 * @module
 */

import { print_css } from "#node/css/mod";
import { print_fragment } from "#node/fragment";
import { print_script } from "#node/script";
import { define_printer } from "#printer";
import type { Root } from "#types";
import { NEW_LINE, insert } from "#util";

/**
 * Print Svelte AST node {@link Root} as string.
 * WARN: There's a huge space being added between instance tag and the Fragment code.
 * Not sure why it happens. Leave it to formatter now.
 * TODO: See warning ^
 */
export const print_root = define_printer((node: Root, options) => {
	const { css, fragment, instance, module } = node;
	const { order = ["module", "instance", "fragment", "css"] } = options?.root ?? {};
	const unduplicated_order = [...new Set(order)];

	return unduplicated_order
		.map((type) => {
			// biome-ignore format: Prettier
			switch (type) {
				case "css": return insert(css && print_css(css, options));
				case "fragment": return print_fragment(fragment, options);
				case "instance": return insert(instance && print_script(instance, options));
				case "module": return insert(module && print_script(module, options));
				default: {
					throw new TypeError(`Unrecognized type ${type} in 'options.root.order'`);
				}
			}
		})
		.join(NEW_LINE + NEW_LINE);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Root", () => {
		it("it prints correctly Svelte code with TypeScript", ({ expect }) => {
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
			const node = parse_and_extract_svelte_node<Root>(code, "Root");
			expect(print_root(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`
				"<script context="module" lang="ts">
				import { defineMeta, setTemplate, Args, StoryContext } from '@storybook/addon-svelte-csf';
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





				{#snippet template({ children, ...args }, context)}
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

				"
			`,
			);
		});
	});
}
