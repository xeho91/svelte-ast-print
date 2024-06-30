import { define_printer } from "#printer";
import type { Comment, Text } from "#types";

export const print_standard = define_printer((node: Comment | Text, _options) => {
	if (node.type === "Comment") {
		return `<!-- ${node.data} -->`;
	}

	return node.raw;
});
