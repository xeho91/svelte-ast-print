import { print_css } from "#node/css";
import { print_fragment } from "#node/fragment";
import { print_script } from "#node/script";
import { define_printer } from "#printer";
import type { Root } from "#types";
import { NEW_LINE } from "#util";

export const print_root = define_printer((node: Root, options) => {
	const { css, fragment, instance, module } = node;
	const { order = ["module", "instance", "fragment", "css"] } = options?.root ?? {};
	const unduplicated_order = [...new Set(order)];

	return unduplicated_order
		.map((type) => {
			// biome-ignore format: Prettier
			switch (type) {
				case "css": return css ? print_css(css, options) : "";
				case "fragment": return print_fragment(fragment, options);
				case "instance": return instance ? print_script(instance, options) : "";
				case "module": return module ? print_script(module, options) : "";
				default: {
					// TODO: Improve message
					throw new TypeError(`Unrecognized type ${type} in order`);
				}
			}
		})
		.join(NEW_LINE);
});
