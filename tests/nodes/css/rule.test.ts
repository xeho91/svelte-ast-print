import type { Css } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

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
		expect(print(node)).toMatchInlineSnapshot(`
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
		expect(print(node)).toMatchInlineSnapshot(`
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
		expect(print(node)).toMatchInlineSnapshot(`"background-color: orange;"`);
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
		expect(print(node)).toMatchInlineSnapshot(`
			"p {
				color: red;
			}"
		`);
	});
});
