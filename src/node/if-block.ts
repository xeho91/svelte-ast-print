import { print } from "esrap";
import type { IfBlock } from "svelte/compiler";

import type { TransformedPrintOptions } from "#options";
import { print_fragment } from "#node/fragment";
import { NEW_LINE } from "#util";

/**
 * @example Before
 * ```ts
 * ```
 *
 * @example After
 * ```ts
 * ```
 */
export function printIfBlock(node: IfBlock, options: TransformedPrintOptions): string {
	const { indent } = options;
	const { consequent } = node;
	const if_start = print_start(node);
	const if_end = "{/if}";

	return `${if_start}${NEW_LINE}${indent}${print_fragment(consequent, options)}${NEW_LINE}${if_end}`;
}

function print_start(node: IfBlock): string {
	const { elseif } = node;
	const block_name = elseif ? "elseif" : "if";

	return `{:${block_name} ${print(node.test).code}}`;
}
