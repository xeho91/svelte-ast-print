import "@total-typescript/ts-reset/recommended";
import type { IterableElement } from "type-fest";

import type {
	AnimateDirective,
	Attribute,
	AwaitBlock,
	BindDirective,
	Block,
	ClassDirective,
	Comment,
	Component,
	ConstTag,
	Css,
	DebugTag,
	Directive,
	EachBlock,
	ElementLike,
	ExpressionTag,
	Fragment,
	HtmlTag,
	IfBlock,
	KeyBlock,
	LetDirective,
	OnDirective,
	RegularElement,
	RenderTag,
	Root,
	Script,
	SlotElement,
	SnippetBlock,
	SpreadAttribute,
	StyleDirective,
	SvelteBody,
	SvelteComponent,
	SvelteDocument,
	SvelteElement,
	SvelteFragment,
	SvelteHead,
	SvelteNode,
	SvelteOptionsRaw,
	SvelteSelf,
	SvelteWindow,
	Tag,
	TemplateNode,
	Text,
	TitleElement,
	TransitionDirective,
	UseDirective,
} from "svelte/compiler";

export type {
	AnimateDirective,
	Attribute,
	AwaitBlock,
	BindDirective,
	Block,
	ClassDirective,
	Comment,
	Component,
	ConstTag,
	Css,
	DebugTag,
	Directive,
	EachBlock,
	ElementLike,
	ExpressionTag,
	Fragment,
	HtmlTag,
	IfBlock,
	KeyBlock,
	LetDirective,
	OnDirective,
	RegularElement,
	RenderTag,
	Root,
	Script,
	SlotElement,
	SnippetBlock,
	SpreadAttribute,
	StyleDirective,
	SvelteBody,
	SvelteComponent,
	SvelteDocument,
	SvelteElement,
	SvelteFragment,
	SvelteHead,
	SvelteNode,
	SvelteOptionsRaw,
	SvelteSelf,
	SvelteWindow,
	Tag,
	TemplateNode,
	Text,
	TitleElement,
	TransitionDirective,
	UseDirective,
};

export type SupportedSvelteNode = TemplateNode | Script | Css.Node | Fragment;

export type AttributeLike = Attribute | SpreadAttribute | Directive;
export const ATTRIBUTE_LIKE_NODE_NAMES = new Set([
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
] as const);
export type AttributeLikeNodeName = IterableElement<typeof ATTRIBUTE_LIKE_NODE_NAMES>;
export const is_attribute_like_node = (node: SvelteNode): node is AttributeLike =>
	ATTRIBUTE_LIKE_NODE_NAMES.has(node.type);

export const BLOCK_NODE_NAMES = new Set([
	"AwaitBlock",
	"Block",
	"EachBlock",
	"IfBlock",
	"KeyBlock",
	"SnippetBlock",
] as const);
export type BlockNodeName = IterableElement<typeof BLOCK_NODE_NAMES>;
export const is_block_node = (node: SvelteNode): node is Block => BLOCK_NODE_NAMES.has(node.type);

export const CSS_AST_NODE_NAMES = new Set([
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
] as const);
export type CssASTNodeName = IterableElement<typeof CSS_AST_NODE_NAMES>;
export const is_css_node = (node: SvelteNode): node is Css.Node => CSS_AST_NODE_NAMES.has(node.type);

export const ELEMENT_LIKE_NODE_NAMES = new Set([
	"Component",
	"TitleElement",
	"SlotElement",
	"RegularElement",
	"SvelteBody",
	"SvelteComponent",
	"SvelteDocument",
	"SvelteElement",
	"SvelteFragment",
	"SvelteHead",
	"SvelteOptionsRaw",
	"SvelteSelf",
	"SvelteWindow",
] as const);
export type ElementLikeNodeName = IterableElement<typeof ELEMENT_LIKE_NODE_NAMES>;
export const is_element_like_node = (node: SvelteNode): node is ElementLike => ELEMENT_LIKE_NODE_NAMES.has(node.type);

export type StandardNode = Comment | Text;
export const STANDARD_NODE_NAMES = new Set([
	//
	"Comment",
	"Text",
] as const);
export type StandardNodeName = IterableElement<typeof STANDARD_NODE_NAMES>;
export const is_standard_node = (node: SvelteNode): node is StandardNode => STANDARD_NODE_NAMES.has(node.type);

export const TAG_NODE_NAMES = new Set([
	//
	"ExpressionTag",
	"HtmlTag",
	"ConstTag",
	"DebugTag",
	"RenderTag",
] as const);
export type TagNodeName = IterableElement<typeof TAG_NODE_NAMES>;
export const is_tag_node = (node: SvelteNode): node is Tag => TAG_NODE_NAMES.has(node.type);

export const is_template_node = (node: SvelteNode): node is TemplateNode =>
	node.type === "Root" ||
	node.type === "Fragment" ||
	is_attribute_like_node(node) ||
	is_block_node(node) ||
	is_css_node(node) ||
	is_element_like_node(node) ||
	is_standard_node(node) ||
	is_tag_node(node);

export type SupportedSvelteNodeName =
	| "Root"
	| "Script"
	| AttributeLikeNodeName
	| BlockNodeName
	| CssASTNodeName
	| ElementLikeNodeName
	| StandardNodeName
	| TagNodeName;
export const is_supported_svelte_node = (node: SvelteNode | Script): node is SupportedSvelteNode =>
	node.type === "Script" || is_template_node(node);
