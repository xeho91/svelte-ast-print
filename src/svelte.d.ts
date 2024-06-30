/**
 * TODO: Convince Svelte maintainers to expose AST node types from this file in `next` package releases
 *
 * Copied from https://github.com/sveltejs/svelte/blob/c42bb04276af0024b49aa46918eec69ad56570a5/packages/svelte/types/index.d.ts#L561
 * @module
 */

declare module "svelte/compiler" {
	import type {
		AssignmentExpression,
		ClassDeclaration,
		Expression,
		FunctionDeclaration,
		Identifier,
		ImportDeclaration,
		ArrayExpression,
		MemberExpression,
		ObjectExpression,
		Pattern,
		ArrowFunctionExpression,
		VariableDeclaration,
		VariableDeclarator,
		FunctionExpression,
		Node,
		Program,
		ChainExpression,
		SimpleCallExpression,
	} from "estree";
	import type { Location } from "locate-character";
	import type { SourceMap } from "magic-string";
	import type { Context } from "zimmerframe";
	/**
	 * `compile` converts your `.svelte` source code into a JavaScript module that exports a component
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-compile
	 * @param source The component source code
	 * @param options The compiler options
	 * */
	function compile(source: string, options: CompileOptions): CompileResult;
	/**
	 * `compileModule` takes your JavaScript source code containing runes, and turns it into a JavaScript module.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-compile
	 * @param source The component source code
	 * */
	function compileModule(source: string, options: ModuleCompileOptions): CompileResult;
	/**
	 * The parse function parses a component, returning only its abstract syntax tree.
	 *
	 * The `modern` option (`false` by default in Svelte 5) makes the parser return a modern AST instead of the legacy AST.
	 * `modern` will become `true` by default in Svelte 6, and the option will be removed in Svelte 7.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-parse
	 * */
	function parse(
		source: string,
		options: {
			filename?: string;
			modern: true;
		},
	): Root;
	/**
	 * The parse function parses a component, returning only its abstract syntax tree.
	 *
	 * The `modern` option (`false` by default in Svelte 5) makes the parser return a modern AST instead of the legacy AST.
	 * `modern` will become `true` by default in Svelte 6, and the option will be removed in Svelte 7.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-parse
	 * */
	function parse(
		source: string,
		options?:
			| {
					filename?: string;
					modern?: false;
			  }
			| undefined,
	): LegacyRoot;
	/**
	 * @deprecated Replace this with `import { walk } from 'estree-walker'`
	 * */
	function walk(): never;
	/**
	 * The result of a preprocessor run. If the preprocessor does not return a result, it is assumed that the code is unchanged.
	 */
	export interface Processed {
		/**
		 * The new code
		 */
		code: string;
		/**
		 * A source map mapping back to the original code
		 */
		map?: string | object; // we are opaque with the type here to avoid dependency on the remapping module for our public types.
		/**
		 * A list of additional files to watch for changes
		 */
		dependencies?: string[];
		/**
		 * Only for script/style preprocessors: The updated attributes to set on the tag. If undefined, attributes stay unchanged.
		 */
		attributes?: Record<string, string | boolean>;
		toString?: () => string;
	}

	/**
	 * A markup preprocessor that takes a string of code and returns a processed version.
	 */
	type MarkupPreprocessor = (options: {
		/**
		 * The whole Svelte file content
		 */
		content: string;
		/**
		 * The filename of the Svelte file
		 */
		filename?: string;
	}) => Processed | void | Promise<Processed | void>;

	/**
	 * A script/style preprocessor that takes a string of code and returns a processed version.
	 */
	type Preprocessor = (options: {
		/**
		 * The script/style tag content
		 */
		content: string;
		/**
		 * The attributes on the script/style tag
		 */
		attributes: Record<string, string | boolean>;
		/**
		 * The whole Svelte file content
		 */
		markup: string;
		/**
		 * The filename of the Svelte file
		 */
		filename?: string;
	}) => Processed | void | Promise<Processed | void>;

	/**
	 * A preprocessor group is a set of preprocessors that are applied to a Svelte file.
	 */
	export interface PreprocessorGroup {
		/** Name of the preprocessor. Will be a required option in the next major version */
		name?: string;
		markup?: MarkupPreprocessor;
		style?: Preprocessor;
		script?: Preprocessor;
	}
	/** The return value of `compile` from `svelte/compiler` */
	export interface CompileResult {
		/** The compiled JavaScript */
		js: {
			/** The generated code */
			code: string;
			/** A source map */
			map: SourceMap;
		};
		/** The compiled CSS */
		css: null | {
			/** The generated code */
			code: string;
			/** A source map */
			map: SourceMap;
		};
		/**
		 * An array of warning objects that were generated during compilation. Each warning has several properties:
		 * - `code` is a string identifying the category of warning
		 * - `message` describes the issue in human-readable terms
		 * - `start` and `end`, if the warning relates to a specific location, are objects with `line`, `column` and `character` properties
		 */
		warnings: Warning[];
		/**
		 * Metadata about the compiled component
		 */
		metadata: {
			/**
			 * Whether the file was compiled in runes mode, either because of an explicit option or inferred from usage.
			 * For `compileModule`, this is always `true`
			 */
			runes: boolean;
		};
		/** The AST */
		ast: any;
	}

	export interface Warning {
		start?: Location;
		end?: Location;
		// TODO there was pos: number in Svelte 4 - do we want to add it back?
		code: string;
		message: string;
		filename?: string;
	}

	export interface CompileError_1 extends Error {
		code: string;
		filename?: string;
		position?: [number, number];
		start?: Location;
		end?: Location;
	}

	type CssHashGetter = (args: {
		name: string;
		filename: string | undefined;
		css: string;
		hash: (input: string) => string;
	}) => string;

	export interface CompileOptions extends ModuleCompileOptions {
		/**
		 * Sets the name of the resulting JavaScript class (though the compiler will rename it if it would otherwise conflict with other variables in scope).
		 * If unspecified, will be inferred from `filename`
		 */
		name?: string;
		/**
		 * If `true`, tells the compiler to generate a custom element constructor instead of a regular Svelte component.
		 *
		 * @default false
		 */
		customElement?: boolean;
		/**
		 * If `true`, getters and setters will be created for the component's props. If `false`, they will only be created for readonly exported values (i.e. those declared with `const`, `class` and `function`). If compiling with `customElement: true` this option defaults to `true`.
		 *
		 * @default false
		 * @deprecated This will have no effect in runes mode
		 */
		accessors?: boolean;
		/**
		 * The namespace of the element; e.g., `"html"`, `"svg"`, `"foreign"`.
		 *
		 * @default 'html'
		 */
		namespace?: Namespace;
		/**
		 * If `true`, tells the compiler that you promise not to mutate any objects.
		 * This allows it to be less conservative about checking whether values have changed.
		 *
		 * @default false
		 * @deprecated This will have no effect in runes mode
		 */
		immutable?: boolean;
		/**
		 * - `'injected'`: styles will be included in the JavaScript class and injected at runtime for the components actually rendered.
		 * - `'external'`: the CSS will be returned in the `css` field of the compilation result. Most Svelte bundler plugins will set this to `'external'` and use the CSS that is statically generated for better performance, as it will result in smaller JavaScript bundles and the output can be served as cacheable `.css` files.
		 * This is always `'injected'` when compiling with `customElement` mode.
		 */
		css?: "injected" | "external";
		/**
		 * A function that takes a `{ hash, css, name, filename }` argument and returns the string that is used as a classname for scoped CSS.
		 * It defaults to returning `svelte-${hash(css)}`.
		 *
		 * @default undefined
		 */
		cssHash?: CssHashGetter;
		/**
		 * If `true`, your HTML comments will be preserved during server-side rendering. By default, they are stripped out.
		 *
		 * @default false
		 */
		preserveComments?: boolean;
		/**
		 *  If `true`, whitespace inside and between elements is kept as you typed it, rather than removed or collapsed to a single space where possible.
		 *
		 * @default false
		 */
		preserveWhitespace?: boolean;
		/**
		 * Set to `true` to force the compiler into runes mode, even if there are no indications of runes usage.
		 * Set to `false` to force the compiler into ignoring runes, even if there are indications of runes usage.
		 * Set to `undefined` (the default) to infer runes mode from the component code.
		 * Is always `true` for JS/TS modules compiled with Svelte.
		 * Will be `true` by default in Svelte 6.
		 * @default undefined
		 */
		runes?: boolean | undefined;
		/**
		 *  If `true`, exposes the Svelte major version in the browser by adding it to a `Set` stored in the global `window.__svelte.v`.
		 *
		 * @default true
		 */
		discloseVersion?: boolean;
		/**
		 * @deprecated Use these only as a temporary solution before migrating your code
		 */
		legacy?: {
			/**
			 * Applies a transformation so that the default export of Svelte files can still be instantiated the same way as in Svelte 4 —
			 * as a class when compiling for the browser (as though using `createClassComponent(MyComponent, {...})` from `svelte/legacy`)
			 * or as an object with a `.render(...)` method when compiling for the server
			 * @default false
			 */
			componentApi?: boolean;
		};
		/**
		 * An initial sourcemap that will be merged into the final output sourcemap.
		 * This is usually the preprocessor sourcemap.
		 *
		 * @default null
		 */
		sourcemap?: object | string;
		/**
		 * Used for your JavaScript sourcemap.
		 *
		 * @default null
		 */
		outputFilename?: string;
		/**
		 * Used for your CSS sourcemap.
		 *
		 * @default null
		 */
		cssOutputFilename?: string;
		/**
		 * If `true`, compiles components with hot reloading support.
		 *
		 * @default false
		 */
		hmr?: boolean;
		/**
		 * If `true`, returns the modern version of the AST.
		 * Will become `true` by default in Svelte 6, and the option will be removed in Svelte 7.
		 *
		 * @default false
		 */
		modernAst?: boolean;
	}

	export interface ModuleCompileOptions {
		/**
		 * If `true`, causes extra code to be added that will perform runtime checks and provide debugging information during development.
		 *
		 * @default false
		 */
		dev?: boolean;
		/**
		 * If `"client"`, Svelte emits code designed to run in the browser.
		 * If `"server"`, Svelte emits code suitable for server-side rendering.
		 * If `false`, nothing is generated. Useful for tooling that is only interested in warnings.
		 *
		 * @default 'client'
		 */
		generate?: "client" | "server" | false;
		/**
		 * Used for debugging hints and sourcemaps. Your bundler plugin will set it automatically.
		 */
		filename?: string;

		/**
		 * Used for ensuring filenames don't leak filesystem information. Your bundler plugin will set it automatically.
		 * @default process.cwd() on node-like environments, undefined elsewhere
		 */
		rootDir?: string;
	}

	type DeclarationKind = "var" | "let" | "const" | "function" | "import" | "param" | "rest_param" | "synthetic";

	export interface Binding {
		node: Identifier;
		/**
		 * - `normal`: A variable that is not in any way special
		 * - `prop`: A normal prop (possibly reassigned or mutated)
		 * - `bindable_prop`: A prop one can `bind:` to (possibly reassigned or mutated)
		 * - `rest_prop`: A rest prop
		 * - `state`: A state variable
		 * - `derived`: A derived variable
		 * - `each`: An each block parameter
		 * - `snippet`: A snippet parameter
		 * - `store_sub`: A $store value
		 * - `legacy_reactive`: A `$:` declaration
		 * - `legacy_reactive_import`: An imported binding that is mutated inside the component
		 */
		kind:
			| "normal"
			| "prop"
			| "bindable_prop"
			| "rest_prop"
			| "state"
			| "frozen_state"
			| "derived"
			| "each"
			| "snippet"
			| "store_sub"
			| "legacy_reactive"
			| "legacy_reactive_import";
		declaration_kind: DeclarationKind;
		/**
		 * What the value was initialized with.
		 * For destructured props such as `let { foo = 'bar' } = $props()` this is `'bar'` and not `$props()`
		 */
		initial: null | Expression | FunctionDeclaration | ClassDeclaration | ImportDeclaration | EachBlock;
		is_called: boolean;
		references: { node: Identifier; path: SvelteNode[] }[];
		mutated: boolean;
		reassigned: boolean;
		scope: Scope;
		/** For `legacy_reactive`: its reactive dependencies */
		legacy_dependencies: Binding[];
		/** Legacy props: the `class` in `{ export klass as class}`. $props(): The `class` in { class: klass } = $props() */
		prop_alias: string | null;
		/**
		 * If this is set, all references should use this expression instead of the identifier name.
		 * If a function is given, it will be called with the identifier at that location and should return the new expression.
		 */
		expression: Expression | ((id: Identifier) => Expression) | null;
		/** If this is set, all mutations should use this expression */
		mutation: ((assignment: AssignmentExpression, context: Context<any, any>) => Expression) | null;
		/** Additional metadata, varies per binding type */
		metadata: {
			/** `true` if is (inside) a rest parameter */
			inside_rest?: boolean;
		} | null;
	}
	export interface BaseNode_1 {
		type: string;
		start?: number;
		end?: number;
	}

	export interface BaseElement_1 extends BaseNode_1 {
		name: string;
		attributes: Array<LegacyAttributeLike>;
		children: Array<LegacyElementLike>;
	}

	export interface LegacyRoot extends BaseNode_1 {
		html: LegacySvelteNode;
		css?: any;
		instance?: any;
		module?: any;
	}

	export interface LegacyAction extends BaseNode_1 {
		type: "Action";
		/** The 'x' in `use:x` */
		name: string;
		/** The 'y' in `use:x={y}` */
		expression: null | Expression;
	}

	export interface LegacyAnimation extends BaseNode_1 {
		type: "Animation";
		/** The 'x' in `animate:x` */
		name: string;
		/** The y in `animate:x={y}` */
		expression: null | Expression;
	}

	export interface LegacyBinding extends BaseNode_1 {
		type: "Binding";
		/** The 'x' in `bind:x` */
		name: string;
		/** The y in `bind:x={y}` */
		expression: Identifier | MemberExpression;
	}

	export interface LegacyBody extends BaseElement_1 {
		type: "Body";
		name: "svelte:body";
	}

	export interface LegacyAttribute extends BaseNode_1 {
		type: "Attribute";
		name: string;
		value: true | Array<Text | LegacyMustacheTag | LegacyAttributeShorthand>;
	}

	export interface LegacyAttributeShorthand extends BaseNode_1 {
		type: "AttributeShorthand";
		expression: Expression;
	}

	export interface LegacyLet extends BaseNode_1 {
		type: "Let";
		/** The 'x' in `let:x` */
		name: string;
		/** The 'y' in `let:x={y}` */
		expression: null | Identifier | ArrayExpression | ObjectExpression;
	}

	export interface LegacyCatchBlock extends BaseNode_1 {
		type: "CatchBlock";
		children: LegacySvelteNode[];
		skip: boolean;
	}

	export interface LegacyClass extends BaseNode_1 {
		type: "Class";
		/** The 'x' in `class:x` */
		name: "class";
		/** The 'y' in `class:x={y}`, or the `x` in `class:x` */
		expression: Expression;
	}

	export interface LegacyDocument extends BaseElement_1 {
		type: "Document";
	}

	export interface LegacyElement {
		type: "Element";
	}

	export interface LegacyEventHandler extends BaseNode_1 {
		type: "EventHandler";
		/** The 'x' in `on:x` */
		name: string;
		/** The 'y' in `on:x={y}` */
		expression: null | Expression;
		modifiers: string[];
	}

	export interface LegacyHead extends BaseElement_1 {
		type: "Head";
	}

	export interface LegacyInlineComponent extends BaseElement_1 {
		type: "InlineComponent";
		/** Set if this is a `<svelte:component>` */
		expression?: Expression;
	}

	export interface LegacyMustacheTag extends BaseNode_1 {
		type: "MustacheTag";
		expression: Expression;
	}

	export interface LegacyOptions {
		type: "Options";
		name: "svelte:options";
		attributes: Array<any>;
	}

	export interface LegacyPendingBlock extends BaseNode_1 {
		type: "PendingBlock";
		children: LegacySvelteNode[];
		skip: boolean;
	}

	export interface LegacyRawMustacheTag extends BaseNode_1 {
		type: "RawMustacheTag";
		expression: Expression;
	}

	export interface LegacySpread extends BaseNode_1 {
		type: "Spread";
		expression: Expression;
	}

	export interface LegacySlot extends BaseElement_1 {
		type: "Slot";
	}

	export interface LegacySlotTemplate extends BaseElement_1 {
		type: "SlotTemplate";
	}

	export interface LegacyThenBlock extends BaseNode_1 {
		type: "ThenBlock";
		children: LegacySvelteNode[];
		skip: boolean;
	}

	export interface LegacyTitle extends BaseElement_1 {
		type: "Title";
		name: "title";
	}

	export interface LegacyConstTag extends BaseNode_1 {
		type: "ConstTag";
		expression: AssignmentExpression;
	}

	export interface LegacyTransition extends BaseNode_1 {
		type: "Transition";
		/** The 'x' in `transition:x` */
		name: string;
		/** The 'y' in `transition:x={y}` */
		expression: null | Expression;
		modifiers: Array<"local" | "global">;
		/** True if this is a `transition:` or `in:` directive */
		intro: boolean;
		/** True if this is a `transition:` or `out:` directive */
		outro: boolean;
	}

	export interface LegacyWindow extends BaseElement_1 {
		type: "Window";
	}

	export interface LegacyComment extends BaseNode_1 {
		type: "Comment";
		/** the contents of the comment */
		data: string;
		/** any svelte-ignore directives — <!-- svelte-ignore a b c --> would result in ['a', 'b', 'c'] */
		ignores: string[];
	}

	type LegacyDirective =
		| LegacyAnimation
		| LegacyBinding
		| LegacyClass
		| LegacyLet
		| LegacyEventHandler
		| StyleDirective
		| LegacyTransition
		| LegacyAction;

	type LegacyAttributeLike = LegacyAttribute | LegacySpread | LegacyDirective;

	type LegacyElementLike =
		| LegacyBody
		| LegacyCatchBlock
		| LegacyComment
		| LegacyDocument
		| LegacyElement
		| LegacyHead
		| LegacyInlineComponent
		| LegacyMustacheTag
		| LegacyOptions
		| LegacyPendingBlock
		| LegacyRawMustacheTag
		| LegacySlot
		| LegacySlotTemplate
		| LegacyThenBlock
		| LegacyTitle
		| LegacyWindow;

	export interface LegacyStyle extends BaseNode_1 {
		type: "Style";
		attributes: any[];
		content: {
			start: number;
			end: number;
			styles: string;
		};
		children: any[];
	}

	export interface LegacySelector extends BaseNode_1 {
		type: "Selector";
		children: Array<Css.Combinator | Css.SimpleSelector>;
	}

	type LegacyCssNode = LegacyStyle | LegacySelector;

	type LegacySvelteNode =
		| LegacyConstTag
		| LegacyElementLike
		| LegacyAttributeLike
		| LegacyAttributeShorthand
		| LegacyCssNode
		| Text;
	/**
	 * The preprocess function provides convenient hooks for arbitrarily transforming component source code.
	 * For example, it can be used to convert a <style lang="sass"> block into vanilla CSS.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-preprocess
	 * */
	function preprocess(
		source: string,
		preprocessor: PreprocessorGroup | PreprocessorGroup[],
		options?:
			| {
					filename?: string;
			  }
			| undefined,
	): Promise<Processed>;
	class CompileError extends Error {
		constructor(code: string, message: string, position: [number, number] | undefined);
		filename: string | undefined;

		position: CompileError_1["position"];

		start: CompileError_1["start"];

		end: CompileError_1["end"];
		code: string;
	}
	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * */
	const VERSION: string;
	/**
	 * Does a best-effort migration of Svelte code towards using runes, event attributes and render tags.
	 * May throw an error if the code is too complex to migrate automatically.
	 *
	 * */
	function migrate(source: string): {
		code: string;
	};
	class Scope {
		constructor(root: ScopeRoot, parent: Scope | null, porous: boolean);

		root: ScopeRoot;
		/**
		 * The immediate parent scope
		 * */
		parent: Scope | null;
		/**
		 * A map of every identifier declared by this scope, and all the
		 * identifiers that reference it
		 * */
		declarations: Map<string, Binding>;
		/**
		 * A map of declarators to the bindings they declare
		 * */
		declarators: Map<import("estree").VariableDeclarator | LetDirective, Binding[]>;
		/**
		 * A set of all the names referenced with this scope
		 * — useful for generating unique names
		 * */
		references: Map<
			string,
			{
				node: import("estree").Identifier;
				path: SvelteNode[];
			}[]
		>;
		/**
		 * The scope depth allows us to determine if a state variable is referenced in its own scope,
		 * which is usually an error. Block statements do not increase this value
		 */
		function_depth: number;

		declare(
			node: import("estree").Identifier,
			kind: Binding["kind"],
			declaration_kind: DeclarationKind,
			initial?:
				| null
				| import("estree").Expression
				| import("estree").FunctionDeclaration
				| import("estree").ClassDeclaration
				| import("estree").ImportDeclaration
				| EachBlock,
		): Binding;
		child(porous?: boolean): Scope;

		generate(preferred_name: string): string;

		get(name: string): Binding | null;

		get_bindings(node: import("estree").VariableDeclarator | LetDirective): Binding[];

		owner(name: string): Scope | null;

		reference(node: import("estree").Identifier, path: SvelteNode[]): void;
		#private;
	}
	class ScopeRoot {
		conflicts: Set<string>;

		unique(preferred_name: string): import("estree").Identifier;
	}
	export namespace Css {
		export interface BaseNode {
			start?: number;
			end?: number;
		}

		export interface StyleSheet extends BaseNode {
			type: "StyleSheet";
			attributes: any[]; // TODO
			children: Array<Atrule | Rule>;
			content: {
				start: number;
				end: number;
				styles: string;
				/** Possible comment atop the style tag */
				comment: Comment | null;
			};
		}

		export interface Atrule extends BaseNode {
			type: "Atrule";
			name: string;
			prelude: string;
			block: Block | null;
		}

		export interface Rule extends BaseNode {
			type: "Rule";
			prelude: SelectorList;
			block: Block;
			metadata: {
				parent_rule: null | Rule;
				has_local_selectors: boolean;
				is_global_block: boolean;
			};
		}

		export interface SelectorList extends BaseNode {
			type: "SelectorList";
			children: ComplexSelector[];
		}

		export interface ComplexSelector extends BaseNode {
			type: "ComplexSelector";
			children: RelativeSelector[];
			metadata: {
				rule: null | Rule;
				used: boolean;
			};
		}

		export interface RelativeSelector extends BaseNode {
			type: "RelativeSelector";
			combinator: null | Combinator;
			selectors: SimpleSelector[];
			metadata: {
				/** :global(..) */
				is_global: boolean;
				/** :root, :host, ::view-transition */
				is_global_like: boolean;
				scoped: boolean;
			};
		}

		export interface TypeSelector extends BaseNode {
			type: "TypeSelector";
			name: string;
		}

		export interface IdSelector extends BaseNode {
			type: "IdSelector";
			name: string;
		}

		export interface ClassSelector extends BaseNode {
			type: "ClassSelector";
			name: string;
		}

		export interface AttributeSelector extends BaseNode {
			type: "AttributeSelector";
			name: string;
			matcher: string | null;
			value: string | null;
			flags: string | null;
		}

		export interface PseudoElementSelector extends BaseNode {
			type: "PseudoElementSelector";
			name: string;
		}

		export interface PseudoClassSelector extends BaseNode {
			type: "PseudoClassSelector";
			name: string;
			args: SelectorList | null;
		}

		export interface Percentage extends BaseNode {
			type: "Percentage";
			value: string;
		}

		export interface NestingSelector extends BaseNode {
			type: "NestingSelector";
			name: "&";
		}

		export interface Nth extends BaseNode {
			type: "Nth";
			value: string;
		}

		export type SimpleSelector =
			| TypeSelector
			| IdSelector
			| ClassSelector
			| AttributeSelector
			| PseudoElementSelector
			| PseudoClassSelector
			| Percentage
			| Nth
			| NestingSelector;

		export interface Combinator extends BaseNode {
			type: "Combinator";
			name: string;
		}

		export interface Block extends BaseNode {
			type: "Block";
			children: Array<Declaration | Rule | Atrule>;
		}

		export interface Declaration extends BaseNode {
			type: "Declaration";
			property: string;
			value: string;
		}

		// for zimmerframe
		export type Node =
			| StyleSheet
			| Rule
			| Atrule
			| SelectorList
			| Block
			| ComplexSelector
			| RelativeSelector
			| Combinator
			| SimpleSelector
			| Declaration;
	}
	export interface BaseNode {
		type: string;
		start?: number;
		end?: number;
		/** This is set during parsing on elements/components/expressions/text (but not attributes etc) */
		parent?: SvelteNode | null;
	}

	export interface Fragment {
		type: "Fragment";
		nodes: Array<Text | Tag | ElementLike | Block | Comment>;
		/**
		 * Fragments declare their own scopes. A transparent fragment is one whose scope
		 * is not represented by a scope in the resulting JavaScript (e.g. an element scope),
		 * and should therefore delegate to parent scopes when generating unique identifiers
		 */
		transparent: boolean;
	}

	/**
	 * - `html`    — the default, for e.g. `<div>` or `<span>`
	 * - `svg`     — for e.g. `<svg>` or `<g>`
	 * - `mathml`  — for e.g. `<math>` or `<mrow>`
	 * - `foreign` — for other compilation targets than the web, e.g. Svelte Native.
	 *               Disallows bindings other than bind:this, disables a11y checks, disables any special attribute handling
	 *               (also see https://github.com/sveltejs/svelte/pull/5652)
	 */
	type Namespace = "html" | "svg" | "mathml" | "foreign";

	export interface Root extends BaseNode {
		type: "Root";
		/**
		 * Inline options provided by `<svelte:options>` — these override options passed to `compile(...)`
		 */
		options: SvelteOptions | null;
		fragment: Fragment;
		/** The parsed `<style>` element, if exists */
		css: Css.StyleSheet | null;
		/** The parsed `<script>` element, if exists */
		instance: Script | null;
		/** The parsed `<script context="module">` element, if exists */
		module: Script | null;
		metadata: {
			/** Whether the component was parsed with typescript */
			ts: boolean;
		};
	}

	export interface SvelteOptions {
		// start/end info (needed for warnings and for our Prettier plugin)
		start: number;
		end: number;
		// options
		runes?: boolean;
		immutable?: boolean;
		accessors?: boolean;
		preserveWhitespace?: boolean;
		namespace?: Namespace;
		customElement?: {
			tag: string;
			shadow?: "open" | "none";
			props?: Record<
				string,
				{
					attribute?: string;
					reflect?: boolean;
					type?: "Array" | "Boolean" | "Number" | "Object" | "String";
				}
			>;
			/**
			 * Is of type
			 * ```ts
			 * (ceClass: new () => HTMLElement) => new () => HTMLElement
			 * ```
			 */
			extend?: ArrowFunctionExpression | Identifier;
		};
		attributes: Attribute[];
	}

	/** Static text */
	export interface Text extends BaseNode {
		type: "Text";
		/** Text with decoded HTML entities */
		data: string;
		/** The original text, with undecoded HTML entities */
		raw: string;
	}

	/** A (possibly reactive) template expression — `{...}` */
	export interface ExpressionTag extends BaseNode {
		type: "ExpressionTag";
		expression: Expression;
		metadata: {
			contains_call_expression: boolean;
			/**
			 * Whether or not the expression contains any dynamic references —
			 * determines whether it will be updated in a render effect or not
			 */
			dynamic: boolean;
		};
	}

	/** A (possibly reactive) HTML template expression — `{@html ...}` */
	export interface HtmlTag extends BaseNode {
		type: "HtmlTag";
		expression: Expression;
	}

	/** An HTML comment */
	// TODO rename to disambiguate
	export interface Comment extends BaseNode {
		type: "Comment";
		/** the contents of the comment */
		data: string;
	}

	/** A `{@const ...}` tag */
	export interface ConstTag extends BaseNode {
		type: "ConstTag";
		declaration: VariableDeclaration & {
			declarations: [VariableDeclarator & { id: Pattern; init: Expression }];
		};
	}

	/** A `{@debug ...}` tag */
	export interface DebugTag extends BaseNode {
		type: "DebugTag";
		identifiers: Identifier[];
	}

	/** A `{@render foo(...)} tag */
	export interface RenderTag extends BaseNode {
		type: "RenderTag";
		expression: SimpleCallExpression | (ChainExpression & { expression: SimpleCallExpression });
	}

	export type Tag = ExpressionTag | HtmlTag | ConstTag | DebugTag | RenderTag;

	/** An `animate:` directive */
	export interface AnimateDirective extends BaseNode {
		type: "AnimateDirective";
		/** The 'x' in `animate:x` */
		name: string;
		/** The y in `animate:x={y}` */
		expression: null | Expression;
	}

	/** A `bind:` directive */
	export interface BindDirective extends BaseNode {
		type: "BindDirective";
		/** The 'x' in `bind:x` */
		name: string;
		/** The y in `bind:x={y}` */
		expression: Identifier | MemberExpression;
		metadata: {
			binding_group_name: Identifier;
			parent_each_blocks: EachBlock[];
		};
	}

	/** A `class:` directive */
	export interface ClassDirective extends BaseNode {
		type: "ClassDirective";
		/** The 'x' in `class:x` */
		name: "class";
		/** The 'y' in `class:x={y}`, or the `x` in `class:x` */
		expression: Expression;
		metadata: {
			dynamic: false;
		};
	}

	/** A `let:` directive */
	export interface LetDirective extends BaseNode {
		type: "LetDirective";
		/** The 'x' in `let:x` */
		name: string;
		/** The 'y' in `let:x={y}` */
		expression: null | Identifier | ArrayExpression | ObjectExpression;
	}

	/** An `on:` directive */
	export interface OnDirective extends BaseNode {
		type: "OnDirective";
		/** The 'x' in `on:x` */
		name: string;
		/** The 'y' in `on:x={y}` */
		expression: null | Expression;
		modifiers: string[]; // TODO specify
	}

	type DelegatedEvent =
		| {
				type: "hoistable";
				function: ArrowFunctionExpression | FunctionExpression | FunctionDeclaration;
		  }
		| { type: "non-hoistable" };

	/** A `style:` directive */
	export interface StyleDirective extends BaseNode {
		type: "StyleDirective";
		/** The 'x' in `style:x` */
		name: string;
		/** The 'y' in `style:x={y}` */
		value: true | Array<ExpressionTag | Text>;
		modifiers: Array<"important">;
		metadata: {
			dynamic: boolean;
		};
	}

	// TODO have separate in/out/transition directives
	/** A `transition:`, `in:` or `out:` directive */
	export interface TransitionDirective extends BaseNode {
		type: "TransitionDirective";
		/** The 'x' in `transition:x` */
		name: string;
		/** The 'y' in `transition:x={y}` */
		expression: null | Expression;
		modifiers: Array<"local" | "global">;
		/** True if this is a `transition:` or `in:` directive */
		intro: boolean;
		/** True if this is a `transition:` or `out:` directive */
		outro: boolean;
	}

	/** A `use:` directive */
	export interface UseDirective extends BaseNode {
		type: "UseDirective";
		/** The 'x' in `use:x` */
		name: string;
		/** The 'y' in `use:x={y}` */
		expression: null | Expression;
	}

	export type Directive =
		| AnimateDirective
		| BindDirective
		| ClassDirective
		| LetDirective
		| OnDirective
		| StyleDirective
		| TransitionDirective
		| UseDirective;

	export interface BaseElement extends BaseNode {
		name: string;
		attributes: Array<Attribute | SpreadAttribute | Directive>;
		fragment: Fragment;
	}

	export interface Component extends BaseElement {
		type: "Component";
	}

	export interface TitleElement extends BaseElement {
		type: "TitleElement";
		name: "title";
	}

	export interface SlotElement extends BaseElement {
		type: "SlotElement";
		name: "slot";
	}

	export interface RegularElement extends BaseElement {
		type: "RegularElement";
		metadata: {
			/** `true` if this is an svg element */
			svg: boolean;
			/** `true` if this is a mathml element */
			mathml: boolean;
			/** `true` if contains a SpreadAttribute */
			has_spread: boolean;
			scoped: boolean;
		};
	}

	export interface SvelteBody extends BaseElement {
		type: "SvelteBody";
		name: "svelte:body";
	}

	export interface SvelteComponent extends BaseElement {
		type: "SvelteComponent";
		name: "svelte:component";
		expression: Expression;
	}

	export interface SvelteDocument extends BaseElement {
		type: "SvelteDocument";
		name: "svelte:document";
	}

	export interface SvelteElement extends BaseElement {
		type: "SvelteElement";
		name: "svelte:element";
		tag: Expression;
		metadata: {
			/**
			 * `true` if this is an svg element. The boolean may not be accurate because
			 * the tag is dynamic, but we do our best to infer it from the template.
			 */
			svg: boolean;
			/**
			 * `true` if this is a mathml element. The boolean may not be accurate because
			 * the tag is dynamic, but we do our best to infer it from the template.
			 */
			mathml: boolean;
			scoped: boolean;
		};
	}

	export interface SvelteFragment extends BaseElement {
		type: "SvelteFragment";
		name: "svelte:fragment";
	}

	export interface SvelteHead extends BaseElement {
		type: "SvelteHead";
		name: "svelte:head";
	}

	/** This is only an intermediate representation while parsing, it doesn't exist in the final AST */
	export interface SvelteOptionsRaw extends BaseElement {
		type: "SvelteOptions";
		name: "svelte:options";
	}

	export interface SvelteSelf extends BaseElement {
		type: "SvelteSelf";
		name: "svelte:self";
	}

	export interface SvelteWindow extends BaseElement {
		type: "SvelteWindow";
		name: "svelte:window";
	}

	export type ElementLike =
		| Component
		| TitleElement
		| SlotElement
		| RegularElement
		| SvelteBody
		| SvelteComponent
		| SvelteDocument
		| SvelteElement
		| SvelteFragment
		| SvelteHead
		| SvelteOptionsRaw
		| SvelteSelf
		| SvelteWindow;

	/** An `{#each ...}` block */
	export interface EachBlock extends BaseNode {
		type: "EachBlock";
		expression: Expression;
		context: Pattern;
		body: Fragment;
		fallback?: Fragment;
		index?: string;
		key?: Expression;
		metadata: {
			contains_group_binding: boolean;
			/** Set if something in the array expression is shadowed within the each block */
			array_name: Identifier | null;
			index: Identifier;
			item: Identifier;
			declarations: Map<string, Binding>;
			/** List of bindings that are referenced within the expression */
			references: Binding[];
			/**
			 * Optimization path for each blocks: If the parent isn't a fragment and
			 * it only has a single child, then we can classify the block as being "controlled".
			 * This saves us from creating an extra comment and insertion being faster.
			 */
			is_controlled: boolean;
		};
	}

	/** An `{#if ...}` block */
	export interface IfBlock extends BaseNode {
		type: "IfBlock";
		elseif: boolean;
		test: Expression;
		consequent: Fragment;
		alternate: Fragment | null;
	}

	/** An `{#await ...}` block */
	export interface AwaitBlock extends BaseNode {
		type: "AwaitBlock";
		expression: Expression;
		// TODO can/should we move these inside the ThenBlock and CatchBlock?
		/** The resolved value inside the `then` block */
		value: Pattern | null;
		/** The rejection reason inside the `catch` block */
		error: Pattern | null;
		pending: Fragment | null;
		then: Fragment | null;
		catch: Fragment | null;
	}

	export interface KeyBlock extends BaseNode {
		type: "KeyBlock";
		expression: Expression;
		fragment: Fragment;
	}

	export interface SnippetBlock extends BaseNode {
		type: "SnippetBlock";
		expression: Identifier;
		parameters: Pattern[];
		body: Fragment;
	}

	export type Block = EachBlock | IfBlock | AwaitBlock | KeyBlock | SnippetBlock;

	export interface Attribute extends BaseNode {
		type: "Attribute";
		name: string;
		value: true | Array<Text | ExpressionTag>;
		metadata: {
			dynamic: boolean;
			/** May be set if this is an event attribute */
			delegated: null | DelegatedEvent;
		};
	}

	export interface SpreadAttribute extends BaseNode {
		type: "SpreadAttribute";
		expression: Expression;
		metadata: {
			contains_call_expression: boolean;
			dynamic: boolean;
		};
	}

	export type TemplateNode =
		| Root
		| Text
		| Tag
		| ElementLike
		| Attribute
		| SpreadAttribute
		| Directive
		| Comment
		| Block;

	export type SvelteNode = Node | TemplateNode | Fragment | Css.Node;

	export interface Script extends BaseNode {
		type: "Script";
		context: string;
		content: Program;
		attributes: Attribute[];
	}

	export type {
		MarkupPreprocessor,
		Preprocessor,
		PreprocessorGroup,
		Processed,
		CompileOptions,
		ModuleCompileOptions,
		CompileResult,
		Warning,
		compile,
		compileModule,
		parse,
		walk,
		preprocess,
		CompileError,
		VERSION,
		migrate,
	};
}
