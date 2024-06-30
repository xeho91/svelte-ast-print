import { define_printer } from "#printer";
import type { Fragment } from "#types";

import { get_printer } from "#node/mod";

export const print_fragment = define_printer((node: Fragment, options) => {
	const { nodes } = node;
	return nodes
		.map((n) => {
			return get_printer(n)(n, options);
		})
		.join("");
});
