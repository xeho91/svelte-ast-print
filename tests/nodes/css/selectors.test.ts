import type { Css } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Css.AttributeSelector", () => {
	it("print correctly without value", ({ expect }) => {
		const code = `
			<style>
				button[disabled] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[disabled]"`);
	});

	it("print correctly with value", ({ expect }) => {
		const code = `
			<style>
				button[aria-disabled="true"] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[aria-disabled="true"]"`);
	});

	it("print correctly with value and flags", ({ expect }) => {
		const code = `
			<style>
				div[aria-disabled="false" s] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[aria-disabled="false" s]"`);
	});
});

describe("Css.ClassSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				.button {
					cursor: pointer;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.ClassSelector>(code, "ClassSelector");
		expect(print(node)).toMatchInlineSnapshot(`".button"`);
	});
});

describe("Css.ComplexSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				:global(div.modal#overlay) {
					opacity: 0;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.ComplexSelector>(code, "ComplexSelector");
		expect(print(node)).toMatchInlineSnapshot(`":global(div.modal#overlay)"`);
	});
});

describe("Css.IdSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				#app {
					max-width: 100lvh;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.IdSelector>(code, "IdSelector");
		expect(print(node)).toMatchInlineSnapshot(`"#app"`);
	});
});

describe("Css.NestingSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					& span {
						color: orange;
					}
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.NestingSelector>(code, "NestingSelector");
		expect(print(node)).toMatchInlineSnapshot(`"&"`);
	});
});

describe("Css.Nth", () => {
	it("prints correctly simple number", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(1) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(1)"`);
	});

	it("prints correctly text value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(odd) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(odd)"`);
	});

	it("prints correctly math-like value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(-1n + 5) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(-1n + 5)"`);
	});

	// FIXME: This is a bug in Svelte, because parser treats it as class selector(?)
	it.fails("prints correctly advanced value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(even of .noted) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Nth>(code, "Nth");
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(even of .noted)"`);
	});
});

describe("Css.Percentage", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				@keyframes fadeIn {
					50% {
						opacity: 0;
					}
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.Percentage>(code, "Percentage");
		expect(print(node)).toMatchInlineSnapshot(`"50%"`);
	});
});

describe("Css.PseudoClassSelector", () => {
	it("prints correctly without args", ({ expect }) => {
		const code = `
			<style>
				p:hover {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.PseudoClassSelector>(code, "PseudoClassSelector");
		expect(print(node)).toMatchInlineSnapshot(`":hover"`);
	});

	it("prints correctly with args", ({ expect }) => {
		const code = `
			<style>
				p:not(.error) {
					color: blue;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.PseudoClassSelector>(code, "PseudoClassSelector");
		expect(print(node)).toMatchInlineSnapshot(`":not(.error)"`);
	});
});

describe("Css.PseudoElementSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p::before {
					content: "NOTE: ";
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.PseudoElementSelector>(code, "PseudoElementSelector");
		expect(print(node)).toMatchInlineSnapshot(`"::before"`);
	});
});

describe("Css.RelativeSelector", () => {
	it("prints correctly without combinator", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.RelativeSelector>(code, "RelativeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
	});

	it("prints correctly with combinators", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.RelativeSelector>(code, "RelativeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
	});
});

describe("Css.SelectorList", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.SelectorList>(code, "SelectorList");
		expect(print(node)).toMatchInlineSnapshot(`"p ~.error +*"`);
	});
});

describe("Css.TypeSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract_svelte_node<Css.TypeSelector>(code, "TypeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
	});
});
