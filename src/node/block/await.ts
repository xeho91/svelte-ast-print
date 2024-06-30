import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { AwaitBlock } from "#types";

export const print_await_block = define_printer((node: AwaitBlock, options) => {
	const { catch: catch_, error, expression, pending, then, value } = node;
	return [
		`{#await ${print(expression).code}}`,
		pending ? print_fragment(pending, options) : "",
		[
			// then block
			"{:then",
			value ? ` ${print(value).code}` : "",
			"}",
			then ? print_fragment(then, options) : "",
		].join(""),
		[
			// catch block
			"{:catch",
			error ? ` ${print(error).code}` : "",
			"}",
			catch_ ? print_fragment(catch_, options) : "",
		].join(""),
		"{/await}",
	].join("");
});
