import { define_printer } from "#printer";
import type { Fragment } from "#types";

export const print_fragment = define_printer((node: Fragment, options) => {
	return "";
});
