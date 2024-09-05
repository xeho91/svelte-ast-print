/**
 * @import * as _reset from "@total-typescript/ts-reset";
 * @import { Node as ESTreeNode } from "estree";
 * @import { AST, Css, parse } from "svelte/compiler";
 */

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L514
 * FIXME: Include `Css.Node` when exposed to public
 * @typedef {ESTreeNode | TemplateNode | AST.Fragment} SvelteNode
 */

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L476
 * @typedef {AST.AnimateDirective | AST.BindDirective | AST.ClassDirective | AST.LetDirective | AST.OnDirective | AST.SpreadAttribute | AST.StyleDirective | AST.TransitionDirective | AST.UseDirective} Directive
 */

/** @typedef {AST.Attribute | AST.SpreadAttribute | Directive} AttributeLike */
const ATTRIBUTE_LIKE_NODE_NAMES = new Set(
	/** @type {const} */ ([
		"AnimateDirective",
		"Attribute",
		"BindDirective",
		"ClassDirective",
		"LetDirective",
		"OnDirective",
		"SpreadAttribute",
		"StyleDirective",
		"TransitionDirective",
		"UseDirective",
	]),
);

/**
 * Type check guard to see if provided AST node is {@link AttributeLike}.
 *
 * - Standard attribute _({@link AST.Attribute})_ - {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * - Spread attribute _({@link AST.SpreadAttribute})_ - {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * - Directive _({@link AST.Directive})_ - can be for:
 *   - component - {@link https://svelte.dev/docs/component-directives}
 *   - element - {@link https://svelte.dev/docs/element-directives}
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AttributeLike}
 */
export const is_attribute_like_node = (node) => ATTRIBUTE_LIKE_NODE_NAMES.has(node.type);

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L486
 * @typedef {AST.EachBlock | AST.IfBlock | AST.AwaitBlock | AST.KeyBlock | AST.SnippetBlock} Block
 */

const BLOCK_NODE_NAMES = new Set(
	/** @type {const} */ ([
		//
		"AwaitBlock",
		"Block",
		"EachBlock",
		"IfBlock",
		"KeyBlock",
		"SnippetBlock",
	]),
);

/**
 * Type check guard to see if provided AST node is a logic block {@link Block}.
 *
 * @see {@link https://svelte.dev/docs/logic-blocks}
 *
 * NOTE: Svelte v5 includes a new block {@link AST.SnippetBlock}
 * @see {@link https://svelte-5-preview.vercel.app/docs/snippets}
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Block}
 */
export const is_block_node = (node) => BLOCK_NODE_NAMES.has(node.type);

const CSS_AST_NODE_NAMES = new Set(
	/** @type {const} */ ([
		"Atrule",
		"AttributeSelector",
		"Block",
		"ClassSelector",
		"Combinator",
		"ComplexSelector",
		"Declaration",
		"IdSelector",
		"NestingSelector",
		"Nth",
		"Percentage",
		"PseudoClassSelector",
		"PseudoElementSelector",
		"RelativeSelector",
		"Rule",
		"SelectorList",
		"StyleSheet",
		"TypeSelector",
	]),
);
/**
 * FIXME: `Css` is not exported
 * Type check guard to see if provided AST node is a CSS based {@link Css.Node}.
 *
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree`!
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Css.Node}
 */
export const is_css_node = (node) => CSS_AST_NODE_NAMES.has(node.type);

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L488
 * @typedef {AST.Component | AST.TitleElement | AST.SlotElement | AST.RegularElement | AST.SvelteBody | AST.SvelteComponent | AST.SvelteDocument | AST.SvelteElement | AST.SvelteFragment | AST.SvelteHead | AST.SvelteOptionsRaw | AST.SvelteSelf | AST.SvelteWindow} ElementLike */

const ELEMENT_LIKE_NODE_NAMES = new Set(
	/** @type {const} */ ([
		"Component",
		"RegularElement",
		"SlotElement",
		"SvelteBody",
		"SvelteComponent",
		"SvelteDocument",
		"SvelteElement",
		"SvelteFragment",
		"SvelteHead",
		"SvelteOptionsRaw",
		"SvelteSelf",
		"SvelteWindow",
		"TitleElement",
	]),
);
/**
 * Type check guard to see if provided AST node is "element-like" {@link ElementLike}.
 *
 * Those are:
 *
 * - standard Svelte-based component - {@link AST.Component}
 * - regular element _(HTML based)_ - {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
 * - special Svelte elements - {@link https://svelte.dev/docs/special-elements}
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is ElementLike}
 */
export const is_element_like_node = (node) => ELEMENT_LIKE_NODE_NAMES.has(node.type);

/** @typedef {AST.Comment | AST.Text} HtmlNode */

const HTML_NODE_NAMES = new Set(
	/** @type {const} */ ([
		//
		"Comment",
		"Text",
	]),
);
/**
 * Type check guard to see if provided AST node is standard HTML node {@link HtmlNode}.
 *
 * Those are:
 *
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 *
 * @param {SvelteNode} node
 * @returns {node is HtmlNode}
 */
export const is_html_node = (node) => HTML_NODE_NAMES.has(node.type);

const TAG_NODE_NAMES = new Set(
	/** @type {const} */ ([
		//
		"ExpressionTag",
		"HtmlTag",
		"ConstTag",
		"DebugTag",
		"RenderTag",
	]),
);

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L474
 * @typedef {AST.ExpressionTag | AST.HtmlTag | AST.ConstTag | AST.DebugTag | AST.RenderTag} Tag
 */

/**
 * Type check guard to see if provided AST node is "tag-like" {@link Tag}.
 *
 * @see {@link https://svelte.dev/docs/special-tags}
 *
 * Not included in the documentation:
 *
 * - expression tag _({@link AST.ExpressionTag})_
 * - render tag _({@link AST.RenderTag})_ - part of Svelte v5
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Tag}
 */
export const is_tag_node = (node) => TAG_NODE_NAMES.has(node.type);

/**
 * TODO: Svelte could expose this type to public too: https://github.com/sveltejs/svelte/blob/2b362ddc63e930726b67a1010d2829a3a4f6bb85/packages/svelte/src/compiler/types/template.d.ts#L503
 * @typedef {AST.Root | AST.Text | Tag | ElementLike | AST.Attribute | AST.SpreadAttribute | Directive | AST.Comment | Block} TemplateNode
 */

/**
 * Type check guard to see if provided AST node is part of node used for templating {@link TemplateNode}.
 *
 * Those are:
 *
 * - root - what you obtain from the results of from using {@link parse}
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 *
 * @param {SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is TemplateNode}
 */
export const is_template_node = (node) =>
	node.type === "Root" ||
	node.type === "Fragment" ||
	is_attribute_like_node(node) ||
	is_block_node(node) ||
	is_css_node(node) ||
	is_element_like_node(node) ||
	is_html_node(node) ||
	is_tag_node(node);

// TODO: Ask Svelte maintainers if `Script` and `SvelteOptions` were omittted from `SvelteNode` intentionally
/**
 * Not all of the nodes are bundled together with {@link AST.BaseNode}.
 * This type wraps them together as supported ones for printing.
 *
 * @typedef {AST.Script | AST.BaseNode | AST.SvelteOptionsRaw | SvelteNode} SupportedSvelteNode
 */

/**
 * Bundle together Svelte and ESTree specification complaint nodes, so we can support printing both.
 *
 * @typedef {ESTreeNode | SupportedSvelteNode} Node
 */

/**
 * Type check guard to see if provided AST node is unique to Svelte AST only {@link SupportedSvelteNode}.
 *
 * @param {Node} node - ESTree or Svelte AST node
 * @returns {node is SupportedSvelteNode}
 */
export const is_svelte_node = (node) =>
	node.type === "SvelteOptions" || node.type === "Script" || is_template_node(node);
