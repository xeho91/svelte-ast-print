import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract_svelte_node } from "#tests/mod";

import { print } from "svelte-ast-print";

describe("Component", () => {
	it("works on example component without children", ({ expect }) => {
		const code = `
			<Slider
				bind:value
				min={0}
				--rail-color="black"
				--track-color="rgb(0, 0, 255)"
			/>
		`;
		const node = parse_and_extract_svelte_node<AST.Component>(code, "Component");
		expect(print(node)).toMatchInlineSnapshot(
			`"<Slider bind:value min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />"`,
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
		const node = parse_and_extract_svelte_node<AST.Component>(code, "Component");
		expect(print(node)).toMatchInlineSnapshot(`
			"<Navbar let:hidden let:toggle>
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
			</Navbar>"
		`);
	});
});

describe("RegularElement", () => {
	it("works on example component without children", ({ expect }) => {
		const code = `
			<input
				bind:value min={0}
				style:--rail-color="black"
				style:--track-color="rgb(0, 0, 255)"
			/>
		`;
		const node = parse_and_extract_svelte_node<AST.RegularElement>(code, "RegularElement");
		expect(print(node)).toMatchInlineSnapshot(
			`"<input bind:value min={0} style:--rail-color="black" style:--track-color="rgb(0, 0, 255)" />"`,
		);
	});

	it("works on example component with children", ({ expect }) => {
		const code = `
			<button on:click={increment}>Clicked {count} {count === 1 ? 'time' : 'times'}</button>
		`;
		const node = parse_and_extract_svelte_node<AST.RegularElement>(code, "RegularElement");
		expect(print(node)).toMatchInlineSnapshot(`
			"<button on:click={increment}>Clicked {count} {count === 1 ? 'time' : 'times'}</button>"
		`);
	});

	it("prints class attribute with string containing expression tags correctly", ({ expect }) => {
		const code = `
			<span class="{name} primary">test</span>
		`;
		const node = parse_and_extract_svelte_node<AST.RegularElement>(code, "RegularElement");
		expect(print(node)).toMatchInlineSnapshot(`"<span class="{name} primary">test</span>"`);
	});
});

describe("SlotElement", () => {
	it("works on example component without children", ({ expect }) => {
		const code = `
			<slot name="description" />
		`;
		const node = parse_and_extract_svelte_node<AST.SlotElement>(code, "SlotElement");
		expect(print(node)).toMatchInlineSnapshot(`"<slot name="description" />"`);
	});

	it("works on example component with children", ({ expect }) => {
		const code = `
			<div>
				<slot name="header">No header was provided</slot>
				<p>Some content between header and footer</p>
			</div>
		`;
		const node = parse_and_extract_svelte_node<AST.SlotElement>(code, "SlotElement");
		expect(print(node)).toMatchInlineSnapshot(`"<slot name="header">No header was provided</slot>"`);
	});
});

describe("SvelteBody", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteBody>(code, "SvelteBody");
		expect(print(node)).toMatchInlineSnapshot(
			`"<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />"`,
		);
	});
});

describe("SvelteBoundary", () => {
	it("works on basic example", ({ expect }) => {
		const code = `
			 <svelte:boundary>
				<FlakyComponent />
				{#snippet failed(error, reset)}
					<button onclick={reset}>oops! try again</button>
				{/snippet}
			 </svelte:boundary>
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteBoundary>(code, "SvelteBoundary");
		expect(print(node)).toMatchInlineSnapshot(
			`
			"<svelte:boundary>
				<FlakyComponent />
				{#snippet failed(error, reset)}
					<button onclick={reset}>oops! try again</button>
				{/snippet}
			</svelte:boundary>"
		`,
		);
	});
});

describe("SvelteComponent", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			<svelte:component this={currentSelection.component} foo={bar} />
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteComponent>(code, "SvelteComponent");
		expect(print(node)).toMatchInlineSnapshot(`"<svelte:component foo={bar} />"`);
	});
});

describe("SvelteDocument", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
				<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />
			`;
		const node = parse_and_extract_svelte_node<AST.SvelteDocument>(code, "SvelteDocument");
		expect(print(node)).toMatchInlineSnapshot(
			`"<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />"`,
		);
	});
});

describe("SvelteElement", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			<svelte:element this={tag} on:click={handler}>Foo</svelte:element>
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteElement>(code, "SvelteElement");
		expect(print(node)).toMatchInlineSnapshot(
			`"<svelte:element this={tag} on:click={handler}>Foo</svelte:element>"`,
		);
	});
});

describe("SvelteFragment", () => {
	it("works when is valid (has children)", ({ expect }) => {
		const code = `
			<svelte:fragment slot="footer">
				<p>All rights reserved.</p>
				<p>Copyright (c) 2019 Svelte Industries</p>
			</svelte:fragment>
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteFragment>(code, "SvelteFragment");
		expect(print(node)).toMatchInlineSnapshot(`
			"<svelte:fragment slot="footer">
				<p>All rights reserved.</p>
				<p>Copyright (c) 2019 Svelte Industries</p>
			</svelte:fragment>"
		`);
	});
});

describe("SvelteHead", () => {
	it("works when is valid (has children)", ({ expect }) => {
		const code = `
			<svelte:head>
				<title>Hello world!</title>
				<meta name="description" content="This is where the description goes for SEO" />
			</svelte:head>
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteHead>(code, "SvelteHead");
		expect(print(node)).toMatchInlineSnapshot(`
			"<svelte:head>
				<title>Hello world!</title>
				<meta name="description" content="This is where the description goes for SEO" />
			</svelte:head>"
		`);
	});
});

describe("SvelteOptions", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			<svelte:options
				customElement={{
					tag: 'custom-element',
					shadow: 'none',
					props: {
						name: { reflect: true, type: 'Number', attribute: 'element-index' }
					},
					extend: (customElementConstructor) => {
						// Extend the class so we can let it participate in HTML forms
						return class extends customElementConstructor {
							static formAssociated = true;

							constructor() {
								super();
								this.attachedInternals = this.attachInternals();
							}

							// Add the function here, not below in the component so that
							// it's always available, not just when the inner Svelte component
							// is mounted
							randomIndex() {
								this.elementIndex = Math.random();
							}
						};
					}
				}}
			/>
		`;
		const node = parse_and_extract_svelte_node<AST.Root>(code, "Root");
		expect(print(node as unknown as AST.SvelteOptionsRaw)).toMatchInlineSnapshot(`
			"<svelte:options customElement={{
				tag: 'custom-element',
				shadow: 'none',
				props: {
					name: {
						reflect: true,
						type: 'Number',
						attribute: 'element-index'
					}
				},
				extend: (customElementConstructor) => {
					// Extend the class so we can let it participate in HTML forms
					return class extends customElementConstructor {
						static formAssociated = true;

						constructor() {
							super();
							this.attachedInternals = this.attachInternals();
						}

						// Add the function here, not below in the component so that
						// it's always available, not just when the inner Svelte component
						// is mounted
						randomIndex() {
							this.elementIndex = Math.random();
						}
					};
				}
			}} />"
		`);
	});
});

describe("SvelteSelf", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			{#if count > 0}
				<p>counting down... {count}</p>
				<svelte:self count={count - 1} />
			{:else}
				<p>lift-off!</p>
			{/if}
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteSelf>(code, "SvelteSelf");
		expect(print(node)).toMatchInlineSnapshot(`"<svelte:self count={count - 1} />"`);
	});
});

describe("SvelteWindow", () => {
	it("works when is valid (has no children)", ({ expect }) => {
		const code = `
			<script>
				/** @param {KeyboardEvent} event */
				function handleKeydown(event) {
					alert(\`pressed the \${event.key} key\`);
				}
			</script>

			<svelte:window on:keydown={handleKeydown} />
		`;
		const node = parse_and_extract_svelte_node<AST.SvelteWindow>(code, "SvelteWindow");
		expect(print(node)).toMatchInlineSnapshot(`"<svelte:window on:keydown={handleKeydown} />"`);
	});
});

describe("TitleElement", () => {
	it("works when is valid (has children)", ({ expect }) => {
		const code = `
			<script>
				const reason = "vibes";
			</script>

			<svelte:head>
				<title>Svelte is optimized for {reason}</title>
			</svelte:head>
		`;
		const node = parse_and_extract_svelte_node<AST.TitleElement>(code, "TitleElement");
		expect(print(node)).toMatchInlineSnapshot(`"<title>Svelte is optimized for {reason}</title>"`);
	});
});
