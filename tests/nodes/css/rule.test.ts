import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";
import { DEFAULT_OPTIONS } from "#options";
import type { Css } from "#types";

import { print } from "svelte-ast-print";

describe("Css.Atrule", () => {
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
		const node = parse_and_extract_svelte_node<Css.Atrule>(code, "Atrule");
		expect(print(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
			"@media screen and (max-width: 1000px) {
				p {
					max-width: 60ch;
				}
			}"
		`);
	});
});

describe("Css.Block", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
					background-color: black;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Block>(code, "Block");
		expect(print(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
			"{
				color: red;
				background-color: black;
			}"
		`);
	});
});

describe("Css.Declaration", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				div {
					background-color: orange;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Declaration>(code, "Declaration");
		expect(print(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"background-color: orange;"`);
	});
});

describe("Css.Rule", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Rule>(code, "Rule");
		expect(print(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
			"p {
				color: red;
			}"
		`);
	});
});
