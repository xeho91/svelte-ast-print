import { define_printer } from "#printer";
import type { Tag } from "#types";

export const print_tag = define_printer((node: Tag, options) => {
	// biome-ignore format: Prettier
	// switch (node.type) {
	// 	case "ConstTag": return node.declaration;
	// 	case "DebugTag": return node.identifiers;
	// 	case "ExpressionTag": return node.expression;
	// 	case "HtmlTag": return node.expression;
	// 	case "RenderTag": return node.expression;
	// }
	return "";
});
