import "@total-typescript/ts-reset/recommended";

import { define_printer } from "#printer";
import type { Css } from "#types";

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
