import { print_const_tag } from "#node/tag/const";
import { print_expression_tag } from "#node/tag/expression";
import { define_printer } from "#printer";
import type { Tag } from "#types";
import { print_html_tag } from "./html.js";

export const print_tag = define_printer((node: Tag, options) => {
	// biome-ignore format: Prettier
	switch (node.type) {
		case "ConstTag": return print_const_tag(node, options);
		case "DebugTag": return "";
		case "ExpressionTag": return print_expression_tag(node, options);
		case "HtmlTag": return print_html_tag(node, options);
		case "RenderTag": return "";
	}
});
