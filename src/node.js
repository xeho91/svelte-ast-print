/**
 * @import * as AST from "svelte/compiler";
 */

/** @typedef {AST.Attribute | AST.SpreadAttribute | AST.Directive} AttributeLike */
export const ATTRIBUTE_LIKE_NODE_NAMES = new Set(
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
 * @param {AST.SvelteNode} node
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
 * @param {AST.SvelteNode} node
 * @returns {node is AST.Block}
 */
export const is_block_node = (node) => BLOCK_NODE_NAMES.has(node.type);

export const CSS_AST_NODE_NAMES = new Set(
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
 * @param {AST.SvelteNode} node
 * @returns {node is AST.Css.Node}
 */
export const is_css_node = (node) => CSS_AST_NODE_NAMES.has(node.type);

export const ELEMENT_LIKE_NODE_NAMES = new Set(
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
 * @param {AST.SvelteNode} node
 * @returns {node is AST.ElementLike}
 */
export const is_element_like_node = (node) => ELEMENT_LIKE_NODE_NAMES.has(node.type);

/** @typedef {Comment | Text} HtmlNode */
export const HTML_NODE_NAMES = new Set(
	/** @type {const} */ ([
		//
		"Comment",
		"Text",
	]),
);
/**
 * @param {AST.SvelteNode} node
 * @returns {node is HtmlNode}
 */
export const is_html_node = (node) => HTML_NODE_NAMES.has(node.type);

export const TAG_NODE_NAMES = new Set(
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
 * @param {AST.SvelteNode} node
 * @returns {node is AST.Tag}
 */
export const is_tag_node = (node) => TAG_NODE_NAMES.has(node.type);

/**
 * @param {AST.SvelteNode} node
 * @returns {node is AST.TemplateNode}
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
 * @param {AST.SvelteNode} node
 * @returns {node is AST.SvelteNode}
 */
export const is_svelte_node = (node) => node.type === "Script" || is_template_node(node);
