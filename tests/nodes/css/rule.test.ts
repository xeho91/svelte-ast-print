import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("AST.CSS.Atrule", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				@media screen and (max-width: 1000px) {
					p {
						max-width: 60ch;
					}
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<AST.CSS.Atrule>(code, "Atrule");
		expect(print(node)).toMatchInlineSnapshot(`
			"@media screen and (max-width: 1000px) {
				p {
					max-width: 60ch;
				}
			}"
		`);
	});
});

describe("AST.CSS.Block", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
					background-color: black;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<AST.CSS.Block>(code, "Block");
		expect(print(node)).toMatchInlineSnapshot(`
			"{
				color: red;
				background-color: black;
			}"
		`);
	});
});

describe("AST.CSS.Declaration", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				div {
					background-color: orange;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<AST.CSS.Declaration>(code, "Declaration");
		expect(print(node)).toMatchInlineSnapshot(`"background-color: orange;"`);
	});
});

describe("AST.CSS.Rule", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<AST.CSS.Rule>(code, "Rule");
		expect(print(node)).toMatchInlineSnapshot(`
			"p {
				color: red;
			}"
		`);
	});
});
