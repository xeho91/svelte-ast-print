import { print } from "esrap";

import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { AwaitBlock, Block, EachBlock, IfBlock, KeyBlock, SnippetBlock } from "#types";

const print_await_block = define_printer((node: AwaitBlock, options) => {
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

const print_each_block = define_printer((node: EachBlock, options) => {
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

const print_if_block = define_printer((node: IfBlock, options) => {
	const { alternate, consequent, elseif, test } = node;
	return [
		[
			//
			"{",
			elseif ? ":else if" : "#if",
			print(test).code,
			"}",
		].join(" "),
		print_fragment(consequent, options),
		alternate ? print_fragment(alternate, options) : "",
		"{/if}",
	].join("");
});

const print_key_block = define_printer((node: KeyBlock, options) => {
	const { expression, fragment } = node;
	return [
		//
		"{#key ",
		print(expression).code,
		print_fragment(fragment, options),
		"}",
	].join("");
});

const print_snippet_block = define_printer((node: SnippetBlock, options) => {
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

export const print_block = define_printer((node: Block, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "AwaitBlock": return print_await_block(node, options);
		case "EachBlock": return print_each_block(node, options);
		case "IfBlock": return print_if_block(node, options);
		case "KeyBlock": return print_key_block(node, options);
		case "SnippetBlock": return print_snippet_block(node, options);

	}
});
