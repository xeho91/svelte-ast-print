import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { SnippetBlock } from "#types";

export const print_snippet_block = define_printer((node: SnippetBlock, options) => {
	const { body, expression, parameters } = node;
	return [
		//
		"{#snippet",
		print(expression).code,
		"(",
		parameters.map((p) => print(p).code).join(", "),
		")",
		print_fragment(body, options),
		"{/snippet}",
	].join("");
});
