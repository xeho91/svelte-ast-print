/**
 * Related to Svelte AST {@link ElementLike} nodes.
 * @see {@link https://svelte.dev/docs/svelte-components}
 * @see {@link https://svelte.dev/docs/special-elements}
 * @module
 */

import { print_component } from "#node/element-like/component";
import { print_regular_element } from "#node/element-like/regular-element";
import { print_slot_element } from "#node/element-like/slot-element";
import { print_svelte_body } from "#node/element-like/svelte-body";
import { print_svelte_component } from "#node/element-like/svelte-component";
import { print_svelte_document } from "#node/element-like/svelte-document";
import { print_svelte_element } from "#node/element-like/svelte-element";
import { print_svelte_fragment } from "#node/element-like/svelte-fragment";
import { print_svelte_head } from "#node/element-like/svelte-head";
import { print_svelte_options } from "#node/element-like/svelte-options";
import { print_svelte_self } from "#node/element-like/svelte-self";
import { print_svelte_window } from "#node/element-like/svelte-window";
import { print_title_element } from "#node/element-like/title-element";
import { define_printer } from "#printer";
import type { ElementLike } from "#types";

export const print_element_like = define_printer((node: ElementLike, options) => {
	const { type } = node;

	// biome-ignore format: Prettier
	switch(type) {
		case "Component": return print_component(node, options);
		case "TitleElement": return print_title_element(node, options);
		case "SlotElement": return print_slot_element(node, options);
		case "RegularElement": return print_regular_element(node, options);
		case "SvelteBody": return print_svelte_body(node, options);
		case "SvelteComponent": return print_svelte_component(node, options);
		case "SvelteDocument": return print_svelte_document(node, options);
		case "SvelteElement": return print_svelte_element(node, options);
		case "SvelteFragment": return print_svelte_fragment(node, options);
		case "SvelteHead": return print_svelte_head(node, options);
		case "SvelteOptions": return print_svelte_options(node, options);
		case "SvelteSelf": return print_svelte_self(node, options);
		case "SvelteWindow": return print_svelte_window(node, options);
	}
});
