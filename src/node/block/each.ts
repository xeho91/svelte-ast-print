import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { EachBlock } from "#types";

export const print_each_block = define_printer((node: EachBlock, options) => {
	const { body, context, expression, index, key } = node;
	return [
		[
			"#{each",
			print(expression).code,
			"as",
			print(context).code,
			index ? `, ${index}` : "",
			key ? `(${print(key).code})` : "",
			"}",
		].join(" "),
		print_fragment(body, options),
		"{/each}",
	].join("");
});
