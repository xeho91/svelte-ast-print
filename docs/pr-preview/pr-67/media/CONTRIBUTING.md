# Contribution guide

Contributions of any kind is welcome. There are several ways how you can contribute.

## Development

This section covers development part.

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

#### Step by step setup

1. Clone this repository

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

---

## Documentation

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
