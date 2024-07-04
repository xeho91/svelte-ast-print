/**
 * @import * as _reset from "@total-typescript/ts-reset";
 * @import { Node as ESTreeNode } from "estree";
 * @import * as Svelte from "svelte/compiler";
 */

/** @typedef {Svelte.Attribute | Svelte.SpreadAttribute | Svelte.Directive} AttributeLike */
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
 * - Standard attribute _({@link Svelte.Attribute})_ - {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * - Spread attribute _({@link Svelte.SpreadAttribute})_ - {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * - Directive _({@link Svelte.Directive})_ - can be for:
 *   - component - {@link https://svelte.dev/docs/component-directives}
 *   - element - {@link https://svelte.dev/docs/element-directives}
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AttributeLike}
 */
export const is_attribute_like_node = (node) => ATTRIBUTE_LIKE_NODE_NAMES.has(node.type);

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
 * Type check guard to see if provided AST node is a logic block {@link Svelte.Block}.
 *
 * @see {@link https://svelte.dev/docs/logic-blocks}
 *
 * NOTE: Svelte v5 includes a new block {@link Svelte.SnippetBlock}
 * @see {@link https://svelte-5-preview.vercel.app/docs/snippets}
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Svelte.Block}
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
 * Type check guard to see if provided AST node is a CSS based {@link Svelte.Css.Node}.
 *
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree`!
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Svelte.Css.Node}
 */
export const is_css_node = (node) => CSS_AST_NODE_NAMES.has(node.type);

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
 * Type check guard to see if provided AST node is "element-like" {@link Svelte.ElementLike}.
 *
 * Those are:
 *
 * - standard Svelte-based component - {@link Svelte.Component}
 * - regular element _(HTML based)_ - {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
 * - special Svelte elements - {@link https://svelte.dev/docs/special-elements}
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Svelte.ElementLike}
 */
export const is_element_like_node = (node) => ELEMENT_LIKE_NODE_NAMES.has(node.type);

/** @typedef {Svelte.Comment | Svelte.Text} HtmlNode */
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
 * - text that is included between HTML tags - {@link Svelte.Text}
 * - HTML comment - {@link Svelte.Comment}
 *
 * @param {Svelte.SvelteNode} node
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
 * Type check guard to see if provided AST node is "tag-like" {@link Svelte.Tag}.
 *
 * @see {@link https://svelte.dev/docs/special-tags}
 *
 * Not included in the documentation:
 *
 * - expression tag _({@link Svelte.ExpressionTag})_
 * - render tag _({@link Svelte.RenderTag})_ - part of Svelte v5
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Svelte.Tag}
 */
export const is_tag_node = (node) => TAG_NODE_NAMES.has(node.type);

/**
 * Type check guard to see if provided AST node is part of node used for templating {@link Svelte.TemplateNode}.
 *
 * Those are:
 *
 * - root - what you obtain from the results of from using {@link Svelte.parse}
 * - text that is included between HTML tags - {@link Svelte.Text}
 * - HTML comment - {@link Svelte.Comment}
 *
 * @param {Svelte.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Svelte.TemplateNode}
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

// TODO: Ask Svelte maintainers if `Script` and `SvelteOptions` were omittted from `SvelteNode` intentionally - possibly forgotten to include
/**
 * Not all of the nodes are bundled together with {@link Svelte.SvelteNode}.
 * This type wraps them together as supported ones for printing.
 *
 * @typedef {Svelte.Script | Svelte.SvelteNode | Svelte.SvelteOptionsRaw} SupportedSvelteNode
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
