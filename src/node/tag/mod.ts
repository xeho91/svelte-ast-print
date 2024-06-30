import { print_expression_tag } from "#node/tag/expression";
import { define_printer } from "#printer";
import type { Tag } from "#types";

export const print_tag = define_printer((node: Tag, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "ConstTag": return "";
		case "DebugTag": return "";
		case "ExpressionTag": return print_expression_tag(node, options);
		case "HtmlTag": return ""
		case "RenderTag": return "";
	}
});
