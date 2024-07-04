/**
 * @import * as SvelteAST from "svelte/compiler";
 * @import { Context } from "zimmerframe";
 *
 * @import { Node } from "./nodes.js";
 */

import { print as print_es } from "esrap";
import { walk } from "zimmerframe";

import { is_element_like_node, is_svelte_node } from "./nodes.js";
import { Options } from "./options.js";

export {
	is_attribute_like_node as isAttributeLikeNode,
	is_block_node as isBlockNode,
	is_css_node as isCssNode,
	is_element_like_node as isElementLikeNode,
	is_html_node as isHtmlNode,
	is_svelte_node as isSvelteNode,
	is_tag_node as isTagNode,
	is_template_node as isTemplateNode,
} from "./nodes.js";

/**
 * Print AST {@link SvelteAST.SvelteNode} as a string.
 * Aka parse in reverse.
 *
 * ## How does it work under the hood?
 *
 * 1. Firstly, it determines whether the provided AST node is unique node for Svelte {@link SvelteAST.Node}.
 * 2. Based on type check guard from above:
 *    - it uses either this package's {@link Printer} to print Svelte AST node,
 *    - otherwise it uses `esrap` {@link print_es} to print ESTree specification-complaint AST node
 *
 * ## How to use it?
 *
 * @example writing a codemode using Node.js
   ```js
   import fs from "node:fs";

   import { print } from "svelte-ast-print";
   import { parse } from "svelte/compiler";

   const originalSvelteCode = fs.readFileSync("src/App.svelte", "utf-8");
   let svelteAST = parse(originalSvelteCode, { modern: true });
   //                                          👆 For now, only modern is supported.
   //                                             By default is 'false'.
   //                                             Is it planned to be 'true' from Svelte v6+

   // ...
   // Do some modifications on this AST...
   // e.g. transform `<slot />` to `{@render children()}`
   // ...

   const output = print(svelteAST); // AST is now a stringified code output! 🎉

   fs.writeFileSync("src/App.svelte", output, { encoding: " utf-8" });
   ```
 *
 * @param {Node} node - Svelte or ESTree AST node
 * @param {Partial<ConstructorParameters<typeof Options>[0]>} options - printing options
 * @returns {string} Stringified Svelte AST node
 * TODO: Ask Svelte maintainers if `Script` and `SvelteOptions` were omittted from `SvelteNode` intentionally - possibly forgotten to include
 */
export function print(node, options = {}) {
	if (is_svelte_node(node)) {
		return new Printer(node, new Options(options)).toString();
	}

	return print_es(node).code;
}

class Printer {
	/**
	 * @type {Node}
	 */
	#node;
	/**
	 * @type {Options}
	 */
	#options;

	/**
	 * @type {number}
	 */
	#depth = 0;
	/**
	 * @type {string}
	 */
	#output = "";

	/**
	 * @param {Node} node - Svelte or ESTree AST node
	 * @param {Options} options - transformed options
	 */
	constructor(node, options) {
		this.#node = node;
		this.#options = options;
		this.#produce();
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return this.#output;
	}

	/**
	 * @param {string} code
	 * @returns {void}
	 */
	#print(code) {
		this.#output += code;
	}

	/**
	 * @returns {void}
	 */
	#print_new_line() {
		this.#output += "\n";
	}

	/**
	 * Depth aware indent
	 * @returns {string}
	 */
	get #indent() {
		const { indent } = this.#options;
		return Array(this.#depth).fill(indent).join("");
	}

	/**
	 * @returns {void}
	 */
	#print_indent() {
		this.#output += this.#indent;
	}

	/**
	 * @typedef PrintEsNodeOptions
	 * @property {boolean} [skip_indent]
	 */

	/**
	 * @param {Parameters<typeof print_es>[0]} node
	 * @param {Partial<PrintEsNodeOptions> | undefined} options
	 * @returns {void}
	 */
	#print_es_node(node, options = {}) {
		const { skip_indent = false } = options;
		const { code } = print_es(node);
		if (skip_indent) this.#output += code;
		else this.#output += code.replace(/^(?=.+)/gm, this.#indent);
	}

	/**
	 * @param {SvelteAST.Text} node
	 * @returns {boolean}
	 */
	#is_text_new_line_or_indents_only(node) {
		const { raw } = node;
		return /^(?:(?: {2}| {4})|\t|\n)*$/.test(raw);
	}

	/**
	 * @param {SvelteAST.Fragment} fragment
	 * @returns {boolean}
	 */
	#has_fragment_element_like_node(fragment) {
		const { nodes } = fragment;
		for (const node of nodes) {
			if (is_element_like_node(node)) return true;
			if (node.type === "Text" && this.#is_text_new_line_or_indents_only(node)) continue;
			break;
		}
		return false;
	}

	/**
	 * @param {SvelteAST.Fragment} fragment
	 * @returns {boolean}
	 */
	#is_fragment_empty(fragment) {
		return fragment.nodes.length === 0;
	}

	/**
	 * @param {SvelteAST.Fragment} node
	 * @param {Context<Node, typeof this>} context
	 * @returns {void}
	 */
	print_block_fragment(node, context) {
		const { visit } = context;
		this.#print_new_line();
		this.#depth++;
		visit(node, this);
		this.#depth--;
	}

	/**
	 * @param {SvelteAST.Fragment} node
	 * @param {Context<Node, typeof this>} context
	 * @returns {void}
	 */
	print_element_like_fragment(node, context) {
		const { visit } = context;
		const has_element_like_node = this.#has_fragment_element_like_node(node);
		if (has_element_like_node) this.#print_new_line();
		visit(node, this);
	}

	/**
	 * @param {SvelteAST.ElementLike} node
	 * @param {Context<Node, typeof this>} context
	 * @returns {void}
	 */
	#print_element_like_attributes(node, context) {
		const { state, visit } = context;
		const { attributes } = node;
		for (const attribute_like of attributes) {
			this.#output += " ";
			visit(attribute_like, state);
		}
		// if (this.#output.at(-1) === "\n") this.#print_indent();
	}

	/**
	 * @param {string} name
	 * @returns {void}
	 */
	#print_element_like_closing_tag(name) {
		if (this.#output.at(-1) === "\n") this.#print_indent();
		this.#print("</");
		this.#print(name);
		this.#print(">");
	}

	/**
	 * @param {SvelteAST.ElementLike} node
	 * @param {Context<Node, typeof this>} context
	 * @returns {void}
	 */
	#print_element_like(node, context) {
		const { fragment, name } = node;
		const is_self_closing = this.#is_fragment_empty(fragment);
		if (this.is_last_output_new_line) this.#print_indent();
		this.#print("<");
		this.#print(name);
		this.#print_element_like_attributes(node, context);
		if (is_self_closing) this.#print(" />");
		else {
			this.#print(">");
			if (fragment) {
				this.#depth++;
				this.print_element_like_fragment(fragment, context);
				this.#depth--;
			}
			this.#print_element_like_closing_tag(name);
		}
	}

	/**
	 * @returns {boolean}
	 */
	get is_last_output_closing_tag() {
		return /\{\/\w*\}$$/.test(this.#output);
	}

	/**
	 * @returns {boolean}
	 */
	get is_last_output_closing_element_like() {
		return /(<\/[^>:]+(:[^>]+)?>|\/>)$/.test(this.#output);
	}

	/**
	 * @returns {boolean}
	 */
	get is_last_output_closing_comment() {
		return /-->$/.test(this.#output);
	}

	/**
	 * @returns {boolean}
	 */
	get is_last_output_new_line() {
		return /\n$/.test(this.#output);
	}

	/**
	 * @returns {void}
	 */
	#produce() {
		walk(this.#node, this, {
			_(_node, context) {
				const { next, state } = context;
				next(state);
			},

			Root(node, context) {
				const { state, stop, visit } = context;
				const { order } = state.#options;
				for (const name of order) {
					const root_node = node[name];
					if (name === "options" && node.options) {
						//  @ts-ignore FIXME: This is likely a bug - at runtime Svelte AST node `SvelteOptions` _(aliased as SvelteOptionsRaw)_ doesn't have 'type' entry
						visit({ ...node.options, type: "SvelteOptions" }, state);
						//  @ts-ignore FIXME: Typing issue `SvelteOptions` and `SvelteOptionsRaw` are incompatible
					} else if (root_node) visit(root_node, state);
				}
				// NOTE: There can't be anything next to Root
				stop();
			},

			Script(node, { state, visit }) {
				const { attributes, content } = node;
				if (state.#output !== "") {
					state.#print_new_line();
					state.#print_new_line();
				}
				state.#print("<script");
				for (const attribute of attributes) {
					state.#print(" ");
					visit(attribute, state);
				}
				state.#print(">");
				state.#print_new_line();
				state.#depth++;
				state.#print_es_node(content);
				state.#depth--;
				state.#print_new_line();
				state.#print("</script>");
			},

			Fragment(node, context) {
				const { nodes } = node;
				const { state, visit } = context;
				for (const node of nodes) {
					visit(node, state);
					if (
						state.is_last_output_closing_tag ||
						state.is_last_output_closing_element_like ||
						state.is_last_output_closing_comment
					) {
						state.#print_new_line();
					}
				}
			},

			Attribute(node, context) {
				const { name, value } = node;
				const { state, visit } = context;
				const is_shorthand =
					value !== true &&
					value[0]?.type === "ExpressionTag" &&
					value[0].expression.type === "Identifier" &&
					value[0].expression.name === name;
				if (!is_shorthand) {
					state.#print(name);
				}
				// NOTE: This is e.g. `<button disabled />`,
				// so its a shorthand - we don't need to append anything
				if (value !== true) {
					// WARN: I can't find a case where it can be an array?
					// This may be a problem in the future
					for (const text_or_expression_tag of value) {
						if (!is_shorthand) state.#print("=");
						text_or_expression_tag.type === "Text" && state.#print('"');
						visit(text_or_expression_tag, state);
						text_or_expression_tag.type === "Text" && state.#print('"');
					}
				}
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment}
			 *
			 * @example pattern
			 * ```html
			 * <!--data-->
			 * ```
			 */
			Comment(node, context) {
				const { data } = node;
				const { state } = context;
				state.#print_indent();
				state.#print("<!--");
				state.#print(data);
				state.#print("-->");
			},

			Text(node, context) {
				const { raw } = node;
				const { state } = context;
				const is_new_line_or_indents_only = state.#is_text_new_line_or_indents_only(node);
				if (!is_new_line_or_indents_only) state.#print(raw);
			},

			/**
			 * @see {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
			 *
			 * @example
			 * ```html
			 * <Widget {...things} />
			 * ```
			 */
			SpreadAttribute(node, context) {
				const { expression } = node;
				const { state } = context;
				state.#print("{...");
				state.#print_es_node(expression, { skip_indent: true });
				state.#print("}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#animate-fn}
			 *
			 * @example without params
			 * ```svelte
			 * animate:name
			 * ```
			 *
			 * @example with params
			 * ```svelte
			 * animate:name={params}
			 * ```
			 */
			AnimateDirective(node, context) {
				const { name, expression } = node;
				const { state } = context;
				state.#print("animate");
				state.#print(":");
				state.#print(name);
				if (expression) {
					state.#print("={");
					state.#print_es_node(expression);
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#bind-property}
			 *
			 * @example pattern
			 * ```svelte
			 * bind:property={variable}
			 * ```
			 */
			BindDirective(node, context) {
				const { name, expression } = node;
				const { state } = context;
				state.#print("bind");
				state.#print(":");
				state.#print(name);
				state.#print("={");
				state.#print_es_node(expression);
				state.#print("}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#class-name}
			 *
			 * @example with value
			 * ```svelte
			 * class:name={value}
			 * ```
			 *
			 * @example without value
			 * ```svelte
			 * class:name
			 * ```
			 */
			ClassDirective(node, context) {
				const { name, expression } = node;
				const { state } = context;
				const is_shorthand = expression.type === "Identifier" && expression.name === name;
				state.#print("class");
				state.#print(":");
				state.#print(name);
				if (!is_shorthand) {
					state.#print("={");
					state.#print_es_node(expression, { skip_indent: true });
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-elements#slot-slot-key-value}
			 *
			 * @example with value
			 * ```svelte
			 * let:item={item}
			 * ```
			 *
			 * @example without value
			 * ```svelte
			 * let:item={item}
			 * ```
			 */
			LetDirective(node, context) {
				const { name, expression } = node;
				const { state } = context;
				state.#print("let");
				state.#print(":");
				state.#print(name);
				if (expression) {
					state.#print("={");
					state.#print_es_node(expression);
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-elements#on-eventname}
			 *
			 * @example without modifiers
			 * ```svelte
			 * on:eventname={handler}
			 * ```
			 *
			 * @example with modifiers
			 * ```svelte
			 * on:eventname|modifiers={handler}
			 * ```
			 */
			OnDirective(node, context) {
				const { name, expression, modifiers } = node;
				const { state } = context;
				state.#print("on");
				state.#print(":");
				state.#print(name);
				if (modifiers.length > 0) {
					state.#print("|");
					state.#print(modifiers.join("|"));
				}
				if (expression) {
					state.#print("={");
					state.#print_es_node(expression, { skip_indent: true });
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#style-property}
			 *
			 * @example with expression tag
			 * ```svelte
			 * style:property={value}
			 * ```
			 *
			 * @example with text expression
			 * ```svelte
			 * style:property="text"
			 * ```
			 *
			 * @example without expression
			 * ```svelte
			 * style:property
			 * ```
			 *
			 * @example with modifiers
			 * ```svelte
			 * style:property|modifiers="text"
			 */
			StyleDirective(node, context) {
				const { name, modifiers, value } = node;
				const { state, visit } = context;
				state.#print("style");
				state.#print(":");
				state.#print(name);
				if (modifiers.length > 0) {
					state.#print("|");
					state.#print(modifiers.join("|"));
				}
				if (value !== true) {
					for (const text_or_expression_tag of value) {
						state.#print("=");
						if (text_or_expression_tag.type === "Text") state.#print(`"`);
						visit(text_or_expression_tag, state);
						if (text_or_expression_tag.type === "Text") state.#print(`"`);
					}
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#transition-fn}
			 * @see {@link https://svelte.dev/docs/element-directives#in-fn-out-fn}
			 *
			 * @example without params
			 * ```svelte
			 * transition|in|out:fn
			 * ```
			 *
			 * @example with params
			 * ```svelte
			 * transition|in|out:fn={params}
			 * ```
			 *
			 * @example with global modifier and without params
			 * ```svelte
			 * transition|in|out:fn|global
			 * ```
			 *
			 * @example with global modifier and with params
			 * ```svelte
			 * transition|in|out:fn|global={params}
			 * ```
			 *
			 * @example with local modifier and without params
			 * ```svelte
			 * transition|in|out:fn|local
			 * ```
			 *
			 * @example with local modifier and with params
			 * ```svelte
			 * transition|in|out:fn|local={params}
			 * ```
			 */
			TransitionDirective(node, context) {
				const { expression, intro, modifiers, name, outro } = node;
				const { state } = context;
				if (intro && !outro) state.#print("in");
				else if (!intro && outro) state.#print("out");
				else state.#print("transition");
				state.#print(":");
				state.#print(name);
				if (modifiers.length > 0) {
					state.#print("|");
					state.#print(modifiers.join("|"));
				}
				if (expression) {
					state.#print("={");
					state.#print_es_node(expression);
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/element-directives#use-action}
			 *
			 * @example UseDirective - without params
			 * ```svelte
			 * use:action
			 * ```
			 *
			 * @example UseDirective - with parameters
			 * ```svelte
			 * use:action={parameters}
			 * ```
			 */
			UseDirective(node, context) {
				const { expression, name } = node;
				const { state } = context;
				state.#print("use");
				state.#print(":");
				state.#print(name);
				if (expression) {
					state.#print("={");
					state.#print_es_node(expression);
					state.#print("}");
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/logic-blocks#await}
			 *
			 * @example standard
			 * ```svelte
			 * {#await expression}...{:then name}...{:catch name}...{/await}
			 * ```
			 *
			 * @example without catch
			 * ```svelte
			 * {#if expression}...{:else if expression}...{/if}
			 * ```
			 *
			 * @example without pending body
			 * ```svelte
			 * {#await expression then name}...{/await}
			 * ```
			 *
			 * @example with catch body only
			 * ```svelte
			 * {#await expression catch name}...{/await}
			 * ```
			 */
			AwaitBlock(node, context) {
				const { catch: catch_, error, expression, pending, then, value } = node;
				const { state } = context;
				state.#print("{#await ");
				state.#print_es_node(expression, { skip_indent: true });
				if (then && !pending) {
					state.#print(" then");
					if (value) {
						state.#print(" ");
						state.#print_es_node(value, { skip_indent: true });
					}
				}
				if (catch_ && !pending) {
					state.#print(" catch");
					if (error) {
						state.#print(" ");
						state.#print_es_node(error, { skip_indent: true });
					}
				}
				state.#print("}");
				if (pending) {
					state.print_block_fragment(pending, context);
				}
				if (then) {
					if (pending) {
						state.#print("{:then");
						if (value) {
							state.#print(" ");
							state.#print_es_node(value, { skip_indent: true });
							state.#print("}");
						}
					}
					state.print_block_fragment(then, context);
				}
				if (catch_) {
					if (pending) {
						state.#print("{:catch");
						if (error) {
							state.#print(" ");
							state.#print_es_node(error, { skip_indent: true });
							state.#print("}");
						}
					}
					state.print_block_fragment(catch_, context);
				}
				state.#print("{/await}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/logic-blocks#each}
			 *
			 * @example simple
			 * ```svelte
			 * {#each expression as name}...{/each}
			 * ```
			 *
			 * @example with index
			 * ```svelte
			 * {#each expression as name, index}...{/each}
			 * ```
			 *
			 * @example keyed
			 * ```svelte
			 * {#each expression as name (key)}...{/each}
			 * ```
			 *
			 * @example with index and keyed
			 * ```svelte
			 * {#each expression as name, index (key)}...{/each}
			 * ```
			 *
			 * @example with else clause for when list is empty
			 * ```svelte
			 * {#each expression as name}...{:else}...{/each}
			 * ```
			 */
			EachBlock(node, context) {
				const { body, context: node_context, expression, fallback, index, key } = node;
				const { state } = context;
				if (state.#depth > 0) state.#print_new_line();
				state.#print_indent();
				state.#print("{#each ");
				state.#print_es_node(expression, { skip_indent: true });
				state.#print(" as ");
				state.#print_es_node(node_context, { skip_indent: true });
				if (index) {
					state.#print(", ");
					state.#print(index);
				}
				if (key) {
					state.#print(" (");
					state.#print_es_node(key);
					state.#print(")");
				}
				state.#print("}");
				state.print_block_fragment(body, context);
				if (fallback) {
					state.#print("{:else}");
					state.print_block_fragment(fallback, context);
				}
				state.#print_indent();
				state.#print("{/each}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/logic-blocks#if}
			 *
			 * @example simple
			 * ```svelte
			 * {#if expression}...{/if}
			 * ```
			 *
			 * @example with else if
			 * ```svelte
			 * {#if expression}...{:else if expression}...{/if}
			 * ```
			 *
			 * @example with else
			 * ```svelte
			 * {#if expression}...{:else}...{/if}
			 * ```
			 *
			 * @example with else if and else
			 * ```svelte
			 * {#if expression}...{:else if expression}...{:else}...{/if}
			 * ```
			 *
			 * @example with multiple else if and else
			 * ```svelte
			 * {#if expression}...{:else if expression}...{:else if expression}...{:else}...{/if}
			 * ```
			 */
			IfBlock(node, context) {
				const { alternate, consequent, elseif, test } = node;
				const { state, visit } = context;
				/** @param {SvelteAST.Fragment} node */
				const has_alternate_else_if = (node) => node.nodes.some((n) => n.type === "IfBlock");
				if (elseif) {
					state.#print("{:else if ");
					state.#print_es_node(test, { skip_indent: true });
					state.#print("}");
					state.#print_new_line();
					visit(consequent, state);
					if (alternate) {
						if (!has_alternate_else_if(alternate)) {
							state.#print("{:else}");
							state.#print_new_line();
						}
						visit(alternate, state);
					}
				} else {
					state.#print("{#if ");
					state.#print_es_node(test, { skip_indent: true });
					state.#print("}");
					state.#print_new_line();
					state.#depth++;
					visit(consequent, state);
					if (alternate) {
						if (!has_alternate_else_if(alternate)) {
							state.#print("{:else}");
							state.#print_new_line();
						}
						visit(alternate, state);
					}
					state.#depth--;
					state.#print("{/if}");
				}
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/logic-blocks#key}
			 *
			 * @example pattern
			 * ```svelte
			 * {#key expression}...{/key}
			 * ```
			 */
			KeyBlock(node, context) {
				const { expression, fragment } = node;
				const { state } = context;
				state.#print("{#key ");
				state.#print_es_node(expression, { skip_indent: true });
				state.#print("}");
				state.print_block_fragment(fragment, context);
				state.#print("{/key}");
			},

			/**
			 *
			 * TODO: Update link to the official doc once Svelte v5 is released
			 * @see {@link https://svelte-5-preview.vercel.app/docs/snippets}
			 *
			 * @example pattern
			 * ```svelte
			 * {#snippet expression(parameters)}...{/snippet}
			 * ```
			 */
			SnippetBlock(node, context) {
				const { body, expression, parameters } = node;
				const { state } = context;
				state.#print("{#snippet ");
				state.#print_es_node(expression);
				state.#print("(");
				parameters.forEach((pattern, index) => {
					state.#print_es_node(pattern);
					if (parameters[index + 1]) state.#print(", ");
				});
				state.#print(")");
				state.#print("}");
				state.print_block_fragment(body, context);
				state.#print("{/snippet}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/svelte-components}
			 */
			Component(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/svelte-components}
			 */
			RegularElement(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-elements#slot}
			 */
			SlotElement(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/special-elements#svelte-body}
			 *
			 * @example
			 * ```svelte
			 * <svelte:body on:event={handler} />
			 * ```
			 */
			SvelteBody(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/special-elements#svelte-component}
			 *
			 * @example
			 * ```svelte
			 * <svelte:component this={currentSelection.component} foo={bar} />
			 * ```
			 */
			SvelteComponent(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-elements#svelte-document}
			 *
			 * @example
			 * ```svelte
			 * <svelte:document bind:prop={value} on:visibilitychange={handleVisibilityChange} use:someAction />
			 * ```
			 */
			SvelteDocument(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-elements#svelte-element}
			 *
			 * @example
			 * ```svelte
			 * <svelte:element this={tag} on:click={handler}>Foo</svelte:element>
			 * ```
			 */
			SvelteElement(node, context) {
				const { fragment, name, tag } = node;
				const { state } = context;
				const is_self_closing = state.#is_fragment_empty(fragment);
				if (state.#output.at(-1) === "\n") state.#print_indent();
				state.#print("<");
				state.#print(name);
				state.#print(" this={");
				state.#print_es_node(tag);
				state.#print("}");
				state.#print_element_like_attributes(node, context);
				if (is_self_closing) state.#print(" />");
				else {
					state.#print(">");
					if (fragment) {
						state.#depth++;
						state.print_element_like_fragment(fragment, context);
						state.#depth--;
					}
					state.#print_element_like_closing_tag(name);
				}
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-fragments#svelte-fragment}
			 *
			 * @example
			 * ```svelte
			 * <svelte:fragment slot="footer">
			 *     <p>All rights reserved.</p>
			 *     <p>Copyright (c) 2019 Svelte Industries</p>
			 * </svelte:fragment>
			 * ```
			 */
			SvelteFragment(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-heads#svelte-head}
			 *
			 * @example
			 * ```svelte
			 * <svelte:head>
			 *     <title>Hello world!</title>
			 *     <meta name="description" content="This is where the description goes for SEO" />
			 * </svelte:head>
			 * ```
			 */
			SvelteHead(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://svelte.dev/docs/special-optionss#svelte-options}
			 *
			 * @example
			 * ```svelte
			 * <svelte:options option={value} />
			 * ```
			 *
			 * WARN: This one is different, because it can be extracted only from {@link SvelteAST.Root}
			 */
			SvelteOptions(node, context) {
				const { state } = context;
				state.#print("<svelte:options");
				state.#print_element_like_attributes(node, context);
				state.#print(" />");
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/special-selfs#svelte-self}
			 *
			 * @example
			 * ```svelte
			 *  <svelte:self count={count - 1} />
			 * ```
			 */
			SvelteSelf(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/special-windows#svelte-window}
			 *
			 * @example
			 * ```svelte
			 * <svelte:window bind:prop={value} on:keydown={handleKeydown} />
			 * ```
			 */
			SvelteWindow(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
			 */
			TitleElement(node, context) {
				const { state } = context;
				state.#print_element_like(node, context);
			},

			/**
			 *
			 * @see {@link https://svelte.dev/docs/special-tags#const}
			 *
			 * @example pattern
			 * ```svelte
			 * {@const assignment}
			 * ```
			 */
			ConstTag(node, context) {
				const { declaration } = node;
				const { state } = context;
				state.#print("{@");
				// NOTE: This is unique, because we need to remove a semicolon at the end.
				state.#print(print_es(declaration).code.slice(0, -1));
				state.#print("}");
			},

			/**
			 */
			DebugTag(node, context) {
				const { identifiers } = node;
				const { state } = context;
				state.#print("{@debug");
				identifiers.forEach((identifier, index) => {
					state.#print(" ");
					state.#print_es_node(identifier);
					if (identifiers[index + 1]) state.#print(", ");
				});
				state.#print("}");
			},

			/**
			 * Print Svelte AST node {@link ExpressionTag} as string.
			 *
			 * @example expression - a possibly reactive template expression
			 * ```svelte
			 * {...}
			 * ```
			 */
			ExpressionTag(node, context) {
				const { expression } = node;
				const { state } = context;
				state.#print("{");
				state.#print_es_node(expression, { skip_indent: true });
				state.#print("}");
			},

			/**
			 */
			HtmlTag(node, context) {
				const { expression } = node;
				const { state } = context;
				state.#print("{@html ");
				state.#print_es_node(expression);
				state.#print("}");
			},

			/**
			 * Print Svelte AST node {@link RenderTag} as string.
			 * TODO: Update link once Svelte v5 is released
			 * @see {@link https://svelte.dev/docs/special-tags#html}
			 *
			 * @example pattern
			 * ```svelte
			 * {@render expression}
			 * ```
			 */
			RenderTag(node, context) {
				const { expression } = node;
				const { state } = context;
				state.#print("{@render ");
				state.#print_es_node(expression);
				state.#print("}");
			},

			/**
			 * @see {@link https://svelte.dev/docs/svelte-components#style}
			 */
			StyleSheet(node, context) {
				const { attributes, children } = node;
				const { state, visit } = context;
				state.#print("<style");
				for (const attribute of attributes) {
					state.#print(" ");
					visit(attribute, state);
				}
				state.#print(">");
				state.#print_new_line();
				state.#depth++;
				children.forEach((child, index) => {
					if (index > 0) state.#print_new_line();
					state.#print_indent();
					visit(child, state);
					if (children[index + 1]) state.#print_new_line();
				});
				state.#depth--;
				state.#print_new_line();
				state.#print("</style>");
			},

			Atrule(node, context) {
				const { block, name, prelude } = node;
				const { state, visit } = context;
				state.#print("@");
				state.#print(name);
				state.#print(" ");
				state.#print(prelude);
				if (block) {
					state.#print(" ");
					visit(block, state);
				}
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors}
			 *
			 * @example syntax
			 * ```css
			 * [name<?matcher><?"value"> flags?]
			 * ```
			 */
			AttributeSelector(node, context) {
				const { flags, matcher, name, value } = node;
				const { state } = context;
				state.#print("[");
				state.#print(name);
				if (matcher) state.#print(matcher);
				if (value) {
					state.#print('"');
					state.#print(value);
					state.#print('"');
				}
				if (flags) {
					state.#print(" ");
					state.#print(flags);
				}
				state.#print("]");
			},

			Block(node, context) {
				const { children } = node;
				const { state, visit } = context;
				state.#print("{");
				state.#print_new_line();
				state.#depth++;
				for (const child of children) {
					state.#print_indent();
					visit(child, state);
					state.#print_new_line();
				}
				state.#depth--;
				state.#print_indent();
				state.#print("}");
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors}
			 *
			 * @example simple
			 * ```css
			 * .class_name { style properties }
			 * ```
			 *
			 * @example equivalent
			 * ```css
			 * [class~=class_name] { style properties }
			 * ```
			 */
			ClassSelector(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print(".");
				state.#print(name);
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors/Selectors_and_combinators#combinators}
			 */
			Combinator(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print(name);
			},

			ComplexSelector(node, context) {
				const { children } = node;
				const { state, visit } = context;
				for (const relative_selector of children) {
					visit(relative_selector, state);
				}
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/CSS_Declaration}
			 */
			Declaration(node, context) {
				const { property, value } = node;
				const { state } = context;
				state.#print(property);
				state.#print(": ");
				// NOTE: It removes any existing indentation, because output will look uglier
				state.#print(value.split(/[\s\t\n]+/).join(" "));
				state.#print(";");
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors}
			 *
			 * @example pattern
			 * ```css
			 * #name
			 * ```
			 */
			IdSelector(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print("#");
				state.#print(name);
			},

			NestingSelector(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print(name);
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child}
			 *
			 * @example pattern
			 * ```css
			 * :nth-child(<nth> [of <complex-selector-list>]?) { }
			 */
			Nth(node, context) {
				const { value } = node;
				const { state } = context;
				state.#print(":nth-child(");
				state.#print(value);
				state.#print(")");
			},

			Percentage(node, context) {
				const { value } = node;
				const { state } = context;
				state.#print(value);
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes}
			 */
			PseudoClassSelector(node, context) {
				const { args, name } = node;
				const { state, visit } = context;
				state.#print(":");
				state.#print(name);
				if (args) {
					state.#print("(");
					visit(args, state);
					state.#print(")");
				}
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements}
			 * WARN: It doesn't support args, e.g. `::part()` or  `::slotted()`
			 */
			PseudoElementSelector(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print("::");
				state.#print(name);
			},

			Rule(node, context) {
				const { block, prelude } = node;
				const { state, visit } = context;
				visit(prelude, state);
				state.#print(" ");
				visit(block, state);
			},

			RelativeSelector(node, context) {
				const { combinator, selectors } = node;
				const { state, visit } = context;
				if (combinator) {
					state.#print(" ");
					visit(combinator, state);
				}
				for (const selector of selectors) {
					visit(selector, state);
				}
			},

			SelectorList(node, context) {
				const { children } = node;
				const { state, visit } = context;
				for (const complex_selector of children) {
					visit(complex_selector, state);
				}
			},

			/**
			 * @see {@link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors}
			 */
			TypeSelector(node, context) {
				const { name } = node;
				const { state } = context;
				state.#print(name);
			},
		});
	}
}
