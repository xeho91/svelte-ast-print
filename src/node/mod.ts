// WARN: This is workaround for cyclic dependency
//
import { print_attribute_like } from "#node/attribute-like/mod";
import { print_block } from "#node/block/mod";
import { print_css } from "#node/css/mod";
import { print_element_like } from "#node/element-like/mod";
import { print_fragment } from "#node/fragment";
import { print_root } from "#node/root";
import { print_script } from "#node/script";
import { print_standard } from "#node/standard";
import { print_tag } from "#node/tag/mod";
import type { Printer } from "#printer";
import type { SupportedSvelteNode } from "#types";

export function get_printer<const TNode extends SupportedSvelteNode>(node: TNode): Printer<TNode> {
	// biome-ignore format: prettier
	switch (node.type) {
		case "Root": return print_root as Printer<TNode>;
		case "Fragment": return print_fragment as Printer<TNode>;
		case "Script": return print_script as Printer<TNode>;
		// Standard related
		case "Comment":
		case "Text": return print_standard as Printer<TNode>;
		// Tag related
		case "ConstTag":
		case "DebugTag":
		case "ExpressionTag":
		case "HtmlTag":
		case "RenderTag": return print_tag as Printer<TNode>;
		// Element-like related
		case "Component":
		case "RegularElement":
		case "SlotElement":
		case "SvelteBody":
		case "SvelteComponent":
		case "SvelteDocument":
		case "SvelteElement":
		case "SvelteFragment":
		case "SvelteHead":
		case "SvelteOptions":
		case "SvelteSelf":
		case "SvelteWindow":
		case "TitleElement": return print_element_like as Printer<TNode>;
		// Attribute-like related
		case "AnimateDirective":
		case "Attribute":
		case "BindDirective":
		case "ClassDirective":
		case "LetDirective":
		case "OnDirective":
		case "SpreadAttribute":
		case "StyleDirective":
		case "TransitionDirective":
		case "UseDirective": return print_attribute_like as Printer<TNode>;
		// Block related
		case "AwaitBlock":
		case "EachBlock":
		case "IfBlock":
		case "KeyBlock":
		case "SnippetBlock": return print_block as Printer<TNode>;
		// CSS related
		case "Atrule":
		case "AttributeSelector":
		case "Block":
		case "ClassSelector":
		case "Combinator":
		case "ComplexSelector":
		case "Declaration":
		case "IdSelector":
		case "NestingSelector":
		case "Nth":
		case "Percentage":
		case "PseudoClassSelector":
		case "PseudoElementSelector":
		case "RelativeSelector":
		case "Rule":
		case "SelectorList":
		case "StyleSheet":
		case "TypeSelector": return print_css as Printer<TNode>;
	}
}
