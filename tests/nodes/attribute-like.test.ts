import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Attribute", () => {
	it("correctly prints boolean value", ({ expect }) => {
		const code = `
			<input required />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"required"`);
	});

	it("correctly prints empty text expression value", ({ expect }) => {
		const code = `
			<input required="" />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"required="""`);
	});

	it("correctly prints text expression value with text", ({ expect }) => {
		const code = `
			<div aria-label="this is a modal box" />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"aria-label="this is a modal box""`);
	});

	it("correctly prints booleanish expression tag value", ({ expect }) => {
		const code = `
			<button {disabled} />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"{disabled}"`);
	});

	it("correctly prints expression tag value with string template", ({ expect }) => {
		const code = `
			<Button id={\`button-\${id}\`} />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"id={\`button-\${id}\`}"`);
	});

	it("correctly prints expression tag with string", ({ expect }) => {
		const code = `
			<Tab name={"Home"} />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"name={"Home"}"`);
	});

	it("correctly prints string with expression tags inside", ({ expect }) => {
		const code = `
			<Button class="{variant} small" />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"class="{variant} small""`);
	});

	it("correctly prints expression tag with array expression", ({ expect }) => {
		const code = `
			<Select values={[1, 2, 3]} />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"values={[1, 2, 3]}"`);
	});

	it("correctly prints expression tag with object expression", ({ expect }) => {
		const code = `
			<Container values={{ min: 1000, max: 1200, display: "grid" }} />
		`;
		const node = parse_and_extract_svelte_node<AST.Attribute>(code, "Attribute");
		expect(print(node)).toMatchInlineSnapshot(`"values={{ min: 1000, max: 1200, display: "grid" }}"`);
	});
});

describe("SpreadAttribute", () => {
	it("works using normal identifier", ({ expect }) => {
		const code = `
			<Widget {...things} />
		`;
		const node = parse_and_extract_svelte_node<AST.SpreadAttribute>(code, "SpreadAttribute");
		expect(print(node)).toMatchInlineSnapshot(`"{...things}"`);
	});

	it("works using $$props", ({ expect }) => {
		const code = `
			<Widget {...$$props} />
		`;
		const node = parse_and_extract_svelte_node<AST.SpreadAttribute>(code, "SpreadAttribute");
		expect(print(node)).toMatchInlineSnapshot(`"{...$$props}"`);
	});

	it("works using $$restProps", ({ expect }) => {
		const code = `
			<Widget {...$$restProps} />
		`;
		const node = parse_and_extract_svelte_node<AST.SpreadAttribute>(code, "SpreadAttribute");
		expect(print(node)).toMatchInlineSnapshot(`"{...$$restProps}"`);
	});
});
