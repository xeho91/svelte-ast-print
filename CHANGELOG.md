# v0.3.0 (Fri Oct 25 2024)

:tada: This release contains work from a new contributor! :tada:

Thank you, Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold)), for all your work!

#### 🚀 Enhancement

- feat: Allow Node v18 [#98](https://github.com/xeho91/svelte-ast-print/pull/98) ([@JReinhold](https://github.com/JReinhold) [@xeho91](https://github.com/xeho91))

#### Authors: 2

- Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold))
- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# v0.2.6 (Thu Sep 05 2024)

#### 🐛 Bug Fix

- fix(dependencies): Remove `lefthook` from `optionalDependencies` [#97](https://github.com/xeho91/svelte-ast-print/pull/97) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# v0.2.5 (Thu Sep 05 2024)

#### 🐛 Bug Fix

- fix: Usage & import of AST types from `svelte/compiler` [#96](https://github.com/xeho91/svelte-ast-print/pull/96) ([@xeho91](https://github.com/xeho91))

#### ⚠️ Pushed to `main`

- test: Fix failing edge case ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# v0.2.4 (Tue Aug 27 2024)

#### 🐛 Bug Fix

- ci(scripts): Add `lint:biome` & `fix:biome` [#95](https://github.com/xeho91/svelte-ast-print/pull/95) ([@xeho91](https://github.com/xeho91))
- fix: Attempt to resolve #92 in future... ([@xeho91](https://github.com/xeho91))
- fix: Breaking change in Svelte on attributes AST nodes [#94](https://github.com/xeho91/svelte-ast-print/pull/94) ([@xeho91](https://github.com/xeho91))

#### ⚠️ Pushed to `main`

- ci: Enable package provenance with GitHub Actions ([@xeho91](https://github.com/xeho91))
- docs: Update `README.md` [skip-ci] ([@xeho91](https://github.com/xeho91))
- ci: Update `vitest` to `v2` ([@xeho91](https://github.com/xeho91))

#### 🏠 Internal

- refactor: Abstract stringifying directives [#85](https://github.com/xeho91/svelte-ast-print/pull/85) ([@xeho91](https://github.com/xeho91))

#### 📝 Documentation

- docs(README): Add formatting with Prettier guide [#93](https://github.com/xeho91/svelte-ast-print/pull/93) ([@xeho91](https://github.com/xeho91))
- docs: Add important note about `modern: true` with Svelte `parse` [#91](https://github.com/xeho91/svelte-ast-print/pull/91) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# v0.2.3 (Wed Jul 10 2024)

#### 🐛 Bug Fix

- fix: Printing `BindDirective` when is a shorthand [#84](https://github.com/xeho91/svelte-ast-print/pull/84) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# v0.2.2 (Tue Jul 09 2024)

#### 🐛 Bug Fix

- fix: Indentation issues [#83](https://github.com/xeho91/svelte-ast-print/pull/83) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# `v0.2.1` (Sun Jul 07 2024)

### 🐛 Bug Fix

- fix: Indentation issue with nested `SnippetBlock` [#82](https://github.com/xeho91/svelte-ast-print/pull/82) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))

---

# `v0.2.0` _(Mon Jul 01 2024)_

:tada: This release contains work from a new contributor! :tada:

Thank you, Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91)), for all your work!

### 🚀 Enhancement

- feat: Add type guards for narrow down the type of Svelte AST node
- feat: Print `Css` [#76](https://github.com/xeho91/svelte-ast-print/pull/76) ([@xeho91](https://github.com/xeho91))
- feat: Print `Root` [#75](https://github.com/xeho91/svelte-ast-print/pull/75) ([@xeho91](https://github.com/xeho91))
- feat: Print `Fragment` [#74](https://github.com/xeho91/svelte-ast-print/pull/74) ([@xeho91](https://github.com/xeho91))
- feat: Print `Script` [#73](https://github.com/xeho91/svelte-ast-print/pull/73) ([@xeho91](https://github.com/xeho91))
- feat: Print `ElementLike` nodes [#72](https://github.com/xeho91/svelte-ast-print/pull/72) ([@xeho91](https://github.com/xeho91))
- feat: Print `AttributeLike` nodes [#71](https://github.com/xeho91/svelte-ast-print/pull/71) ([@xeho91](https://github.com/xeho91))
- feat: Print `Comment` & `Text` [#70](https://github.com/xeho91/svelte-ast-print/pull/70) ([@xeho91](https://github.com/xeho91))
- feat: Print `RenderTag` [#69](https://github.com/xeho91/svelte-ast-print/pull/69) ([@xeho91](https://github.com/xeho91))
- feat: Print `DebugTag` [#68](https://github.com/xeho91/svelte-ast-print/pull/68) ([@xeho91](https://github.com/xeho91))
- feat: Print `HtmlTag` [#67](https://github.com/xeho91/svelte-ast-print/pull/67) ([@xeho91](https://github.com/xeho91))
- feat: Print `ConstTag` [#66](https://github.com/xeho91/svelte-ast-print/pull/66) ([@xeho91](https://github.com/xeho91))
- feat: Print `EachBlock` [#65](https://github.com/xeho91/svelte-ast-print/pull/65) ([@xeho91](https://github.com/xeho91))
- feat: Print `SnippetBlock` [#64](https://github.com/xeho91/svelte-ast-print/pull/64) ([@xeho91](https://github.com/xeho91))
- feat: Print `AwaitBlock` [#63](https://github.com/xeho91/svelte-ast-print/pull/63) ([@xeho91](https://github.com/xeho91))
- feat: Print `KeyBlock` [#61](https://github.com/xeho91/svelte-ast-print/pull/61) ([@xeho91](https://github.com/xeho91))
- feat: Print `ExpressionTag` [#62](https://github.com/xeho91/svelte-ast-print/pull/62) ([@xeho91](https://github.com/xeho91))
- feat: Print `IfBlock` [#60](https://github.com/xeho91/svelte-ast-print/pull/60) ([@xeho91](https://github.com/xeho91))

#### Authors: 1

- Mateusz Kadlubowski ([@xeho91](https://github.com/xeho91))
