/**
 * Related to Svelte AST {@link TransitionDirective} node.
 * @module
 */

import { print } from "esrap";

import { define_printer } from "#printer";
import type { TransitionDirective } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link TransitionDirective} as string.
 *
 * @see {@link https://svelte.dev/docs/element-directives#transition-fn}
 * @see {@link https://svelte.dev/docs/element-directives#in-fn-out-fn}
 *
 * @example without params
 * ```svelte
 * transition|in|out:fn
 * ```
 *
 * @example with params
 * ```svelte
 * transition|in|out:fn={params}
 * ```
 *
 * @example with global modifier and without params
 * ```svelte
 * transition|in|out:fn|global
 * ```
 *
 * @example with global modifier and with params
 * ```svelte
 * transition|in|out:fn|global={params}
 * ```
 *
 * @example with local modifier and without params
 * ```svelte
 * transition|in|out:fn|local
 * ```
 *
 * @example with local modifier and with params
 * ```svelte
 * transition|in|out:fn|local={params}
 * ```
 */
export const print_transition_directive = define_printer((node: TransitionDirective, _options) => {
	const { expression, intro, modifiers, name, outro } = node;

	return insert(
		intro && outro && "transition",
		intro && !outro && "in",
		!intro && outro && "out",
		":",
		name,
		modifiers.length > 0 && "|",
		modifiers.join("|"),
		expression && insert("={", print(expression).code, "}"),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("TransitionDirective", () => {
		it("works when using transition", ({ expect }) => {
			const code = `
				{#if visible}
					<div transition:scale>scales in, scales out</div>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"transition:scale"`);
		});

		it("works when using intro", ({ expect }) => {
			const code = `
				{#if visible}
					<div in:fly>flies in</div>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"in:fly"`);
		});

		it("works when using outro", ({ expect }) => {
			const code = `
				{#if visible}
					<div out:fade>fades out</div>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"out:fade"`);
		});

		it("works when using params", ({ expect }) => {
			const code = `
				{#if visible}
					<p transition:fly={{ y: 200, duration: 2000 }}>
						Flies in and out
					</p>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"transition:fly={{ y: 200, duration: 2000 }}"`,
			);
		});

		it("works when using modifiers", ({ expect }) => {
			const code = `
				{#if visible}
					<p transition:fade|global>fades in and out when x or y change</p>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"transition:fade|global"`);
		});

		it("works when using modifiers and with params", ({ expect }) => {
			const code = `
				{#if visible}
					<p transition:fade|local={{ y: 200, duration: 2000 }}>fades in and out when x or y change</p>
				{/if}
			`;
			const node = parse_and_extract_svelte_node<TransitionDirective>(code, "TransitionDirective");
			expect(print_transition_directive(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"transition:fade|local={{ y: 200, duration: 2000 }}"`,
			);
		});
	});
}
