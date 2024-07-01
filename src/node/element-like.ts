import { print } from "esrap";

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { ElementLike } from "#types";

export const print_element_like = define_printer((node: ElementLike, options) => {
	const { name, attributes, fragment } = node;
	const has_child_nodes = fragment.nodes.length > 0;
	const start_closing_tag = has_child_nodes ? ">" : " />";
	const start = `<${name}${print_specials(node)}${print_attributes(attributes, options)}${start_closing_tag}`;
	const end = has_child_nodes ? `</${name}>` : "";

	return `${start}${print_fragment(fragment, options)}${end}`;
});

function print_specials(node: ElementLike): string {
	// biome-ignore format: Prettier
	switch(node.type) {
		case "Component":
		case "TitleElement":
		case "SlotElement":
		case "RegularElement":
		case "SvelteBody":
		case "SvelteDocument":
		case "SvelteFragment":
		case "SvelteHead":
		case "SvelteOptions":
		case "SvelteSelf":
		case "SvelteWindow": return "";
		case "SvelteComponent": return ` this={${print(node.expression)}}`;
		case "SvelteElement": return ` this={${print(node.tag)}}`;
	}
}
