/**
 * @import * as _reset from "@total-typescript/ts-reset";
 * @import { Node as ESTreeASTNode } from "estree";
 * @import * as SvelteAST from "svelte/compiler";
 */

/** @typedef {SvelteAST.Attribute | SvelteAST.SpreadAttribute | SvelteAST.Directive} AttributeLike */
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
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is AttributeLike}
 */
export const is_attribute_like_node = (node) => ATTRIBUTE_LIKE_NODE_NAMES.has(node.type);

export const BLOCK_NODE_NAMES = new Set(
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
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is SvelteAST.Block}
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
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is SvelteAST.Css.Node}
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
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is SvelteAST.ElementLike}
 */
export const is_element_like_node = (node) => ELEMENT_LIKE_NODE_NAMES.has(node.type);

/** @typedef {Comment | Text} HtmlNode */
const HTML_NODE_NAMES = new Set(
	/** @type {const} */ ([
		//
		"Comment",
		"Text",
	]),
);
/**
 * @param {SvelteAST.SvelteNode} node
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
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is SvelteAST.Tag}
 */
export const is_tag_node = (node) => TAG_NODE_NAMES.has(node.type);

/**
 * @param {SvelteAST.SvelteNode} node
 * @returns {node is SvelteAST.TemplateNode}
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

/**
 * @typedef {SvelteAST.Script | SvelteAST.SvelteNode | SvelteAST.SvelteOptionsRaw} SupportedSvelteNode
 */

/**
 * @typedef {ESTreeASTNode | SupportedSvelteNode} Node
 * TODO: Ask Svelte maintainers if `Script` and `SvelteOptions` were omittted from `SvelteNode` intentionally - possibly forgotten to include
 */

/**
 * @param {Node} node
 * @returns {node is SupportedSvelteNode}
 */
export const is_svelte_node = (node) =>
	node.type === "SvelteOptions" || node.type === "Script" || is_template_node(node);
