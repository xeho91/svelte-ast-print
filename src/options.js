/**
 * @import { PrintOptions } from "./types.ts";
 */

/** @satisfies {PrintOptions["format"]["indent"]} */
export const DEFAULT_INDENT = "tab";
/** @satisfies {PrintOptions["root"]["order"]} */
export const DEFAULT_ORDER = /** @type {const} */ (["options", "module", "instance", "fragment", "css"]);

export class Options {
	static INDENT = new Map(
		/** @type {const} */ ([
			["tab", "\t"],
			["2-space", "  "],
			["4-space", "    "],
		]),
	);

	/**
	 * @private
	 * @type {PrintOptions} raw options, before tranformation - for better DX
	 */
	#raw;

	/**
	 * @param {PrintOptions} raw
	 */
	constructor(raw) {
		this.#raw = raw;
	}

	get indent() {
		const { format } = this.#raw;
		const transformed = Options.INDENT.get(format?.indent ?? DEFAULT_INDENT);
		if (!transformed) {
			throw new Error(`Unrecognized indent name - ${format?.indent}, allowed are: ${[...Options.INDENT.keys()]}`);
		}
		return transformed;
	}

	/** @type {NonNullable<NonNullable<PrintOptions["root"]>["order"]>} */
	get order() {
		const { root } = this.#raw;

		return root?.order ?? DEFAULT_ORDER;
	}
}
