/**
 * Related to Svelte AST node {@link Component}.
 * @see {@link https://svelte.dev/docs/svelte-components}
 * @module
 */

import { print_attributes } from "#node/attribute-like/mod";
import { print_fragment } from "#node/fragment";
import { define_printer } from "#printer";
import type { Component } from "#types";
import { insert } from "#util";

/**
 * Print Svelte AST node {@link Component} as string.
 * @see {@link https://svelte.dev/docs/svelte-components}
 */
export const print_component = define_printer((node: Component, options) => {
	const { attributes, fragment, name } = node;
	const is_self_closing = fragment.nodes.length === 0;

	return insert(
		"<",
		name,
		attributes.length > 0 && " ",
		print_attributes(attributes, options),
		is_self_closing ? " />" : ">",
		!is_self_closing && insert(print_fragment(fragment, options), `</${name}>`),
	);
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Component", () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
				<Slider
					bind:value min={0}
					--rail-color="black"
					--track-color="rgb(0, 0, 255)"
				/>
			`;
			const node = parse_and_extract_svelte_node<Component>(code, "Component");
			expect(print_component(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(
				`"<Slider bind:value={value} min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />"`,
			);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
				<Navbar let:hidden let:toggle>
					<NavBrand href="/">
						<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
						<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
					</NavBrand>

					<NavHamburger on:click={toggle} />

					<NavUl {hidden}>
						<NavLi href="/">Home</NavLi>
						<NavLi class="cursor-pointer">
							Mega menu<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
						</NavLi>

						<MegaMenu items={menu} let:item>
							<a href={item.href} class="hover:text-primary-600 dark:hover:text-primary-500">{item.name}</a>
						</MegaMenu>

						<NavLi href="/services">Services</NavLi>
						<NavLi href="/services">Products</NavLi>
						<NavLi href="/services">Contact</NavLi>
					</NavUl>
				</Navbar>
			`;
			const node = parse_and_extract_svelte_node<Component>(code, "Component");
			expect(print_component(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`
				"<Navbar let:hidden let:toggle>
					<NavBrand href="/">
						<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
						<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite
					</NavBrand>

					<NavHamburger on:click={toggle} />

					<NavUl {hidden}>
						<NavLi href="/">Home</NavLi>
						<NavLi class="cursor-pointer">
							Mega menu<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
						</NavLi>

						<MegaMenu items={menu} let:item>
							<a href={item.href} class="hover:text-primary-600 dark:hover:text-primary-500">{item.name}
						</MegaMenu>

						<NavLi href="/services">Services</NavLi>
						<NavLi href="/services">Products</NavLi>
						<NavLi href="/services">Contact</NavLi>
					</NavUl>
				</Navbar>"
			`);
		});
	});
}
