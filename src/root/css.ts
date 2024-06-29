import type { Root } from "svelte/compiler";

import type { TransformedPrintOptions } from "#options";
import { print_attributes } from "#root/shared";
import { NEW_LINE } from "#util";

export function print_css(node: Root["css"], options: TransformedPrintOptions): string {
	if (!node) {
		return "";
	}
	const { attributes, content } = node;

	return `<style ${print_attributes(attributes)}>${NEW_LINE}${content}${NEW_LINE}</style>`;
}
