import type { Root } from "svelte/compiler";
import type { IterableElement, ReadonlyTuple } from "type-fest";

import type { DEFAULT_ORDER, Options } from "#options";

type Indent = IterableElement<typeof Options.INDENT>[0];

interface FormatOptions {
	/**
	 * Indentation style.
	 * @default "tab"
	 */
	indent?: Indent;
}

type RootNode = Extract<keyof Root, "css" | "fragment" | "instance" | "module" | "options">;

interface RootOptions {
	/**
	 * Specify the order you want to use.
	 * @default {@link DEFAULT_ORDER}
	 */
	order: ReadonlyTuple<RootNode, 5>;
}

export interface PrintOptions {
	format?: FormatOptions;
	root?: RootOptions;
}
