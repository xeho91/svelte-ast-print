import type { Root } from "#types";

export interface FormatOptions {
	/** Indentation */
	indent: Indent | (string & {});
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface AttributeLikeOptions {
	//
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface BlockOptions {
	//
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface CssOptions {
	//
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface ElementLikeOptions {
	//
}

export interface RootOptions {
	order: (keyof Root)[];
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface ScriptOptions {
	//
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface StandardOptions {
	//
}

// biome-ignore lint/suspicious/noEmptyInterface: WIP
export interface TagOptions {
	//
}

type Indent = keyof typeof INDENT;
const INDENT = {
	tab: "\t",
	"2-spaces": "  ",
	"4-spaces": "    ",
} as const;

export interface PrintOptions {
	format: FormatOptions;
	attribute: AttributeLikeOptions;
	block: BlockOptions;
	css: CssOptions;
	element: ElementLikeOptions;
	root: RootOptions;
	script: ScriptOptions;
	standard: StandardOptions;
	tag: TagOptions;
}

const DEFAULT_OPTIONS = {
	format: {
		indent: "tab",
	},
	attribute: {},
	block: {},
	css: {},
	element: {},
	root: {
		order: ["module", "instance", "fragment", "css"],
	},
	script: {},
	standard: {},
	tag: {},
} as const satisfies PrintOptions;

export function transform_options<const TOptions extends Partial<PrintOptions> = Partial<PrintOptions>>(
	options = {} as TOptions,
): PrintOptions {
	const defaulted_options = { ...DEFAULT_OPTIONS, ...options };
	const { format, ...rest_base } = defaulted_options;
	const { indent, ...rest_format } = format;

	return {
		...rest_base,
		format: {
			...rest_format,
			indent: INDENT[indent],
		},
	};
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(transform_options.name, () => {
		it("transforms indent correctly", ({ expect }) => {
			const expected = { ...DEFAULT_OPTIONS, format: { indent: "\t" } } satisfies PrintOptions;
			const results = transform_options({ format: { indent: "tab" } });
			expect(results).toStrictEqual(expected);
			expectTypeOf(results).toMatchTypeOf<PrintOptions>();
		});
	});
}
