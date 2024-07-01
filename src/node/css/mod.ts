import { print_css_atrule } from "#node/css/atrule";
import { print_css_attribute_selector } from "#node/css/attribute-selector";
import { print_css_block } from "#node/css/block";
import { print_css_class_selector } from "#node/css/class-selector";
import { print_css_combinator } from "#node/css/combinator";
import { print_css_complex_selector } from "#node/css/complex-selector";
import { print_css_declaration } from "#node/css/declaration";
import { print_css_id_selector } from "#node/css/id-selector";
import { print_css_nesting_selector } from "#node/css/nesting-selector";
import { print_css_nth } from "#node/css/nth";
import { print_css_percentage } from "#node/css/percentage";
import { print_css_pseudo_class_selector } from "#node/css/pseudo-class-selector";
import { print_css_pseudo_element_selector } from "#node/css/pseudo-element-selector";
import { print_css_relative_selector } from "#node/css/relative-selector";
import { print_css_rule } from "#node/css/rule";
import { print_css_selector_list } from "#node/css/selector-list";
import { print_css_style_sheet } from "#node/css/style-sheet";
import { print_css_type_selector } from "#node/css/type-selector";
import { define_printer } from "#printer";
import type { Css } from "#types";

export const print_css = define_printer((node: Css.Node, options) => {
	const { type } = node;
	// biome-ignore format: Prettier
	switch (type) {
		case "StyleSheet": return print_css_style_sheet(node, options);
		case "Atrule": return print_css_atrule(node, options);
		case "AttributeSelector": return print_css_attribute_selector(node, options);
		case "Block": return print_css_block(node, options);
		case "ClassSelector": return print_css_class_selector(node, options);
		case "Combinator": return print_css_combinator(node, options);
		case "ComplexSelector": return print_css_complex_selector(node, options);
		case "Declaration": return print_css_declaration(node, options);
		case "IdSelector": return print_css_id_selector(node, options);
		case "NestingSelector": return print_css_nesting_selector(node, options);
		case "Nth": return print_css_nth(node, options);
		case "Percentage": return print_css_percentage(node, options);
		case "PseudoClassSelector": return print_css_pseudo_class_selector(node, options);
		case "PseudoElementSelector": return print_css_pseudo_element_selector(node, options);
		case "RelativeSelector": return print_css_relative_selector(node, options);
		case "Rule": return print_css_rule(node, options);
		case "SelectorList": return print_css_selector_list(node, options);
		case "TypeSelector": return print_css_type_selector(node, options);
	}
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css", () => {
		it("it prints correctly style tag and its content", ({ expect }) => {
			const code = `
				<style>
					p {
						/* this will only affect <p> elements in this component */
						color: burlywood;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.Node>(code, "StyleSheet");
			expect(print_css(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<style>
					p {
					color: burlywood;
				}
				</style>"
			`);
		});
	});
}
