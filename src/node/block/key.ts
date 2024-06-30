import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { KeyBlock } from "#types";

export const print_key_block = define_printer((node: KeyBlock, options) => {
	const { expression, fragment } = node;
	return [
		//
		"{#key ",
		print(expression).code,
		print_fragment(fragment, options),
		"}",
	].join("");
});
