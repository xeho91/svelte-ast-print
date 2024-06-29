type Indent = keyof typeof INDENT;
const INDENT = {
	tab: "\t",
	"2-spaces": "  ",
	"4-spaces": "    ",
} as const;

export type SvelteRootNode = "css" | "fragment" | "instance" | "module";

export interface PrintOptions {
	indent: Indent;
	order: SvelteRootNode[];
}

export function transform_options(options: PrintOptions): TransformedPrintOptions {
	const { indent } = options;

	return {
		...options,
		indent: INDENT[indent],
	};
}

export interface TransformedPrintOptions {
	indent: (typeof INDENT)[Indent];
	order: SvelteRootNode[];
}

if (import.meta.vitest) {
	const { describe, expectTypeOf, it } = import.meta.vitest;

	describe(transform_options.name, () => {
		it("transforms indent correctly", ({ expect }) => {
			const expected = { indent: "\t", order: [] } as const satisfies TransformedPrintOptions;
			const results = transform_options({ indent: "tab", order: [] });
			expect(results).toStrictEqual(expected);
			expectTypeOf(results).toMatchTypeOf<TransformedPrintOptions>();
		});
	});
}
