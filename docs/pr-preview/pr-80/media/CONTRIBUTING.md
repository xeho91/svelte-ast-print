# Contribution guide

Contributions of any kind is welcome. There are several ways on how you can do it.\
Keep in mind that this project has [Code of Conduct](https://github.com/xeho91/svelte-ast-print?tab=coc-ov-file).

## Development

<details>
<summary>This section covers development part.</summary>

### Setup

If you intend to setup this project locally, ensure you have right prerequisites from below table:

#### Prerequisites

You must have those tools installed.

| Importance | Dependency | Version                                              |
| ---------- | ---------- | ---------------------------------------------------- |
| ❗required | [Node.js]  | LTS                                                  |
| ❗required | [pnpm]     | Use `corepack enable` to automatically setup version |
| _optional_ | [typos]    | latest                                               |

---

#### Step by step

1. Clone this repository.

1. Setup the used Node.js package manager with [corepack]:

   ```sh
   corepack enable
   ```

1. Install project dependencies with pnpm:

   ```sh
   pnpm install
   ```

1. _(optional)_ Install Git hooks with:

   ```sh
   pnpm lefthook install
   ```

   > [!NOTE]
   > This can save your time and project's CI & CD usage _(even if it's free)_

1. Take a look at the `"scripts"` in [`./package.json`](../package.json#scripts) to see if you can find what you need.

   For the the usage convienience those scripts concurrently run related tasks:
   - `pnpm build`
   - `pnpm dev` <- this is for the development

1. If you intend to push changes...
   You can either rely on the optional step 4 to automatically do lint checks _(related to the changed files)_
   for you while attempting to create a commit message.\
   Otherwise use `pnpm lint`.

1. If lint checks has found any issue(s), see if you can automatically fix it by running `pnpm fix`.

</details>

---

## Documentation

![TypeDoc coverage status](https://xeho91.github.io/svelte-ast-print/coverage.svg)

This project uses [TypeDoc], which under the hood uses [JSDoc].\
You're free to:

- improve wording,
- fix typos,
- add some examples,
- and everything else that is related to improving the documentation.

<!-- LINKS -->

[Node.js]: https://github.com/nodejs/node
[pnpm]: https://github.com/pnpm/pnpm
[typos]: https://github.com/crate-ci/typos
[corepack]: https://github.com/nodejs/corepack
[TypeDoc]: https://github.com/TypeStrong/typedoc
[JSDoc]: https://github.com/jsdoc/jsdoc
