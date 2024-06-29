import { print } from "esrap";
import type { Root } from "svelte/compiler";

import type { TransformedPrintOptions } from "#options";
import { print_attributes } from "#root/shared";
import { NEW_LINE } from "#util";

export function print_module(node: Root["module"], options: TransformedPrintOptions): string {
	if (!node) {
		return "";
	}

	const { attributes, context, content } = node;

	if (context !== "module") {
		// TODO: Improve message
		throw new TypeError("I did not expect this!");
	}

	return `<script context="module" ${print_attributes(attributes)}>${NEW_LINE}${print(content)}${NEW_LINE}</script>`;
}
