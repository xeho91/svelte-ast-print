import { print } from "esrap";
import type { Root } from "svelte/compiler";

import type { TransformedPrintOptions } from "#options";
import { print_attributes } from "#root/shared";
import { NEW_LINE } from "#util";

export function print_instance(node: Root["instance"], options: TransformedPrintOptions): string {
	if (!node) {
		return "";
	}

	const { attributes, content } = node;

	return `<script ${print_attributes(attributes)}>${NEW_LINE}${print(content)}${NEW_LINE}</script>`;
}
