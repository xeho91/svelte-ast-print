// WARN: This is workaround for cyclic dependency

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
import type { Printer } from "#printer";
import type { Css } from "#types";

export function get_css_printer<const TNode extends Css.Node>(node: TNode): Printer<TNode> {
	const { type } = node;
	// biome-ignore format: Prettier
	switch (type) {
		case "StyleSheet": return print_css_style_sheet as Printer<TNode>;
		case "Atrule": return print_css_atrule as Printer<TNode>;
		case "AttributeSelector": return print_css_attribute_selector as Printer<TNode>;
		case "Block": return print_css_block as Printer<TNode>;
		case "ClassSelector": return print_css_class_selector as Printer<TNode>;
		case "Combinator": return print_css_combinator as Printer<TNode>;
		case "ComplexSelector": return print_css_complex_selector as Printer<TNode>;
		case "Declaration": return print_css_declaration as Printer<TNode>;
		case "IdSelector": return print_css_id_selector as Printer<TNode>;
		case "NestingSelector": return print_css_nesting_selector as Printer<TNode>;
		case "Nth": return print_css_nth as Printer<TNode>;
		case "Percentage": return print_css_percentage as Printer<TNode>;
		case "PseudoClassSelector": return print_css_pseudo_class_selector as Printer<TNode>;
		case "PseudoElementSelector": return print_css_pseudo_element_selector as Printer<TNode>;
		case "RelativeSelector": return print_css_relative_selector as Printer<TNode>;
		case "Rule": return print_css_rule as Printer<TNode>;
		case "SelectorList": return print_css_selector_list as Printer<TNode>;
		case "TypeSelector": return print_css_type_selector as Printer<TNode>;
	}
}
