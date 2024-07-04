/**
 * @import { Css, Fragment, Root, Script, SvelteOptionsRaw } from "svelte/compiler";
 * @import { IterableElement, ReadonlyTuple } from "type-fest";
 *
 * @import { print } from "./mod.js";
 */

/**
 * Options for {@link print} defined by user.
 *
 * @typedef PrintOptions
 * @property {Partial<FormatOptions>} [format] - formatting options
 * @property {Partial<RootOptions>} [root] - Svelte AST node {@link Root} based options
 */

/**
 * Name _(alias)_ for indentation type. This package will automatically determine a desired indent.
 * @typedef {IterableElement<typeof Options.INDENT>[0]} IndentName
 */

/**
 * @satisfies {IndentName}
 */
export const DEFAULT_INDENT = "tab";

/**
 * Options related to formatting.
 * Provided for building a stable API - gives an space for expansion on future improvements/features.
 *
 * @typedef FormatOptions
 * @property {IndentName} [indent] - defaults to {@link DEFAULT_INDENT}
 */

/**
 * @typedef {Extract<keyof Root, "css" | "fragment" | "instance" | "module" | "options">} RootNode
 */

/**
 * Specified order of {@link Root} child AST nodes to print out.
 *
 * ## Legend
 *
 * - `"options"` - {@link SvelteOptionsRaw}
 * - `"module"` - {@link Script}
 * - `"instance"` - {@link Script}
 * - `"fragment"` - {@link Fragment}
 * - `"css"` - {@link Css.StyleSheet}
 *
 * @typedef {ReadonlyTuple<RootNode, 5>} RootOrder
 */

// TODO: Use generic type parameter, so we use it only when passed node is {@link Root}
/**
 * Options related to {@link Root} Svelte AST node.
 * @typedef RootOptions
 * @property {RootOrder} [order] - defaults to {@link DEFAULT_ORDER}
 */

/**
 * @satisfies {ReadonlyTuple<RootNode, 5>}
 */
export const DEFAULT_ORDER = /** @type {const} */ (["options", "module", "instance", "fragment", "css"]);

/**
 * This class is for internal use only.
 * Give sa a better control on transforming passed options to the second argument of {@link print}
 *
 * @private
 * @internal
 */
export class Options {
	static INDENT = new Map(
		/** @type {const} */ ([
			["tab", "\t"],
			["2-space", "  "],
			["4-space", "    "],
		]),
	);

	/**
	 * @type {PrintOptions} raw options - _(before transformation)_ - for better DX
	 */
	#raw;

	/**
	 * @param {PrintOptions} raw - provided options by user - before transformation
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

	/** @type {RootOrder} */
	get order() {
		const { root } = this.#raw;

		return root?.order ?? DEFAULT_ORDER;
	}
}
