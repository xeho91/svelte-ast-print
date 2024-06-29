import type { Fragment } from "svelte/compiler";

import type { TransformedPrintOptions } from "#options";

export function print_fragment(node: Fragment, options: TransformedPrintOptions): string {
	const { indent } = options;
	const { nodes } = node;

	return "";
}
