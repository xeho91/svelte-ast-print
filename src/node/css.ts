import "@total-typescript/ts-reset/recommended";
import type { IterableElement } from "type-fest";

import { define_printer } from "#printer";
import { print_attributes_like } from "#node/attribute-like";
import type { Css, SvelteNode } from "#types";
import { NEW_LINE } from "#util";

const print_style_sheet = define_printer((node: Css.StyleSheet, options) => {
	// const { attributes, content } = node;
	// const { indent } = options;
	//
	// return `<style${print_attributes_like(attributes)}>${NEW_LINE}${indent}${content}${NEW_LINE}</style>`;
	return "";
});

export const print_css = define_printer((node: Css.Node, options) => {
	// switch (node.type) {
	// 	case "StyleSheet":
	// 	case "Nth":
	// 	case "Rule":
	// 	case "Block":
	// 	case "Atrule":
	// 	case "Combinator":
	// 	case "IdSelector":
	// 	case "Percentage":
	// 	case "Declaration":
	// 	case "SelectorList":
	// 	case "TypeSelector":
	// 	case "ClassSelector":
	// 	case "ComplexSelector":
	// 	case "NestingSelector":
	// 	case "RelativeSelector":
	// 	case "AttributeSelector":
	// 	case "PseudoClassSelector":
	// 	case "PseudoElementSelector": return;
	// }

	return "";
});
