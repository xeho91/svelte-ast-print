import { print } from "esrap";

import { define_printer } from "#printer";
import { print_attributes_like } from "#node/attribute-like";
import type { Script } from "#types";
import { NEW_LINE } from "#util";

export const print_script = define_printer((node: Script, options) => {
	const { attributes, content } = node;
	return `<script ${print_context(node)}${print_attributes_like(attributes, options)}>${NEW_LINE}${print(content)}${NEW_LINE}</script>`;
});

function print_context(node: Script): string {
	const { context } = node;
	return context ? `context="${context}"` : "";
}
