# Contributing to Kvale

Thank you for considering a contribution to Kvale. This document covers everything you need to know before you open an issue, submit a pull request, or propose a change. Please read it in full — it is short and saves both of us time.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Security & Integrity Policy](#security--integrity-policy)
- [Developer Certificate of Origin (DCO)](#developer-certificate-of-origin-dco)
- [Intellectual Property & Copyright](#intellectual-property--copyright)
- [Getting Started](#getting-started)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Submitting Code](#submitting-code)
- [Issue Template](#issue-template)
- [Pull Request Template](#pull-request-template)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Design Principles](#design-principles)
- [Questions](#questions)

---

## Code of Conduct

We follow one rule: **be kind**. We are building tools for developers, by developers. Treat every contributor with the same respect you'd want in return. Harassment, bad faith arguing, or hostile communication will result in removal from the project with no warning.

We do not have a lengthy code of conduct document because we do not think lengthy documents fix culture. We just expect you to act like a professional.

---

## Security & Integrity Policy

This is non-negotiable.

**The following are strictly prohibited and will result in immediate permanent ban from the project:**

- Introducing **bugs, vulnerabilities, backdoors, or exploits** — intentional or deliberate — into any part of the codebase, including tests, build scripts, documentation generators, or dependencies.
- Submitting code that **exfiltrates data, phones home, or performs any action beyond its declared purpose**.
- Attempting to **obfuscate malicious behavior** within an otherwise legitimate-looking contribution.
- **Supply chain attacks** of any form — compromising build tools, CI workflows, or the release pipeline.

This policy is inspired by and consistent with the standards of the Linux kernel, Chromium, and other security-conscious open source projects. If you discover a security vulnerability in Kvale (rather than attempting to introduce one), please report it privately to [Kal](https://github.com/qkal) before disclosing publicly.

We take the integrity of this project seriously. Any PR that introduces suspicious behavior — even if unintentional — will be closed and the contributor will be asked to explain before any further contributions are considered.

---

## Developer Certificate of Origin (DCO)

Kvale uses the **Developer Certificate of Origin 1.1** (used by the Linux kernel, GitLab, and thousands of other open source projects) instead of a Contributor License Agreement.

By making a contribution to this project, you certify that:

```
Developer Certificate of Origin
Version 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I have
    the right to submit it under the open source license indicated in
    the file; or

(b) The contribution is based upon previous work that, to the best of
    my knowledge, is covered under an appropriate open source license
    and I have the right under that license to submit that work with
    modifications, whether created in whole or in part by me, under the
    same open source license (unless I am permitted to submit under a
    different license), as indicated in the file; or

(c) The contribution was provided directly to me by some other person
    who certified (a), (b) or (c) and I have not modified it.

(d) I understand and agree that this project and the contribution are
    public and that a record of the contribution (including all personal
    information I submit with it, including my sign-off) is maintained
    indefinitely and may be redistributed consistent with this project
    or the open source license(s) involved.
```

### How to sign off

Add the following line to every commit message you submit:

```
Signed-off-by: Your Full Name <your@email.com>
```

You can do this automatically with the `-s` flag:

```bash
git commit -s -m "feat: add refetchInterval polling support"
```

**PRs that do not include sign-offs on all commits will not be merged.**

---

## Intellectual Property & Copyright

By submitting a contribution to Kvale — whether code, documentation, tests, or any other material — you agree to the following:

1. **Your contribution is licensed under the project's MIT License.** You grant Kal and Complexia a perpetual, irrevocable, royalty-free license to use, reproduce, modify, and distribute your contribution as part of this project.

2. **You waive the right to assert copyright claims against this project** based on your contribution. Once submitted and merged, your contribution becomes part of Kvale and is covered by the project's existing copyright and license. You may not later issue copyright notices, DMCA takedowns, or similar claims against Kvale or Complexia based on contributions you submitted.

3. **You retain your own copyright** to the contribution itself — you are free to use the same code in other projects under any terms you choose. This is not a copyright assignment. It is a license grant.

4. The DCO sign-off is your acknowledgment of these terms. It is legally meaningful.

This policy is consistent with the approach taken by the CNCF, Linux Foundation, and other major open source foundations.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kvale.git
   cd kvale
   ```
3. **Install dependencies** with Bun — this is the only supported package manager:
   ```bash
   bun install
   ```
4. **Run tests** to confirm your environment is working:
   ```bash
   bun test
   ```
5. **Create a branch** for your work:
   ```bash
   git checkout -b feat/your-feature-name
   ```

Do **not** submit PRs that introduce `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` files. We use `bun.lock` only.

---

## Reporting Bugs

Before opening a bug report, please:

- Search existing issues to avoid duplicates.
- Confirm the bug is reproducible on the latest published version.
- Check whether the issue is in Kvale or in your own code (common with reactivity edge cases).

Use the [Issue Template](#issue-template) below when filing. Bug reports without reproduction steps will be closed without comment.

## Suggesting Features

We love good ideas, but Kvale has strong opinions about scope. Before opening a feature request, ask yourself:

- Does this make the library *simpler* or *more powerful*? We are not interested in both at once.
- Does this require a new dependency? If so, it will not be accepted.
- Does it require a wrapper component, context provider, or global store? If so, it will not be accepted.
- Would this break the zero-dep constraint or the core/adapter boundary? If so, it will not be accepted.

Open a feature request with the **problem you are trying to solve** — not the solution you have in mind. We may find a better solution together.

## Submitting Code

- **Small fixes** (typos, docs, obvious one-line bugs): open a PR directly, no issue needed.
- **Bug fixes**: open an issue first to confirm the bug is acknowledged, then submit a PR.
- **New features or API changes**: open an issue and get alignment *before* writing code. We do not want you spending a week on a PR we cannot merge.

---

## Issue Template

When opening a bug report, include the following:

```markdown
## Description

A clear, one-sentence summary of the problem.

## Steps to Reproduce

1. ...
2. ...
3. ...

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened. Include any error messages, stack traces, or console output.

## Minimal Reproduction

A minimal code snippet or REPL link that demonstrates the issue. This is required.
If you cannot provide a reproduction, explain why.

## Environment

- Kvale version:
- Svelte version:
- SvelteKit version (if applicable):
- Bun / Node version:
- Browser (if applicable):

## Additional Context

Anything else that might be relevant.
```

---

## Pull Request Template

When opening a pull request, fill in the following:

```markdown
## Summary

What does this PR do? One paragraph, plain language.

## Motivation

Why is this change needed? Link to the related issue if one exists.

## Changes

- [ ] Item 1
- [ ] Item 2

## Testing

How did you test this? What test cases were added or updated?

## Breaking Changes

Does this change break any existing behavior or public API? If yes, describe what breaks and why the change is justified.

## Checklist

- [ ] All tests pass (`bun test`)
- [ ] Lint and format checks pass (`bun run lint && bun run format`)
- [ ] New public APIs have JSDoc comments with `@example` blocks
- [ ] All commits are signed off (`Signed-off-by:`)
- [ ] No new dependencies introduced
- [ ] `src/core/` does not import from Svelte
```

---

## Development Setup

```bash
# Install dependencies
bun install

# Run tests (single pass)
bun test

# Run tests in watch mode
bun test:watch

# Type-check
bun run check

# Lint
bun run lint

# Auto-format
bun run format

# Build the package
bun run package
```

All scripts are defined in `package.json`. Always use `bun run`, never `npm run` or `yarn`.

---

## Project Structure

```
src/
├── core/           # Pure TypeScript — zero framework dependencies
│   ├── cache.ts    # CacheStore: Map-based storage, staleness, persistence
│   ├── query.ts    # QueryRunner: fetch, retry, polling, lifecycle
│   ├── types.ts    # All interfaces and config types
│   └── storage.ts  # localStorage persistence adapter
├── svelte/         # Svelte 5 adapter — bridges core to $state reactivity
│   └── adapter.svelte.ts
└── index.ts        # Public API surface

tests/
├── core/           # Core tests — no Svelte imports allowed
└── svelte/         # Adapter tests — uses @testing-library/svelte
```

**The most critical architectural boundary:**

`src/core/` must **never** import from `svelte`, `svelte/store`, or any `.svelte` file. The core is pure TypeScript that runs in any JS environment. The Svelte adapter bridges core events into `$state` reactivity.

Breaking this boundary is an automatic rejection.

---

## Testing

All contributions must include tests. There are no exceptions.

**Rules:**

- Core tests (`tests/core/`) must not import anything Svelte-related
- Use `vi.useFakeTimers()` for any time-dependent behavior (staleTime, polling, retry delays)
- Mock `fetch` with `vi.fn()` — never hit real network endpoints in tests
- Every public API function must have unit tests
- Test file naming: `*.test.ts` for core, `*.test.svelte.ts` for adapter

Run tests before pushing:

```bash
bun test
```

All tests must pass. PRs with failing tests will not be reviewed.

---

## Code Style

We use **Biome** for formatting and linting. Run it before committing:

```bash
bun run format
bun run lint
```

Conventions:

- **TypeScript strict mode** — no `any`, ever
- Use `interface` over `type` for public API shapes
- Private class fields use the `private` keyword
- All public exports must have JSDoc comments with `@example` blocks
- Runes only: `$state`, `$effect`, `$derived` — no `writable()`, `readable()`, or `$:`

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description>

[optional body — explain WHY, not what]

Signed-off-by: Your Name <your@email.com>
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Adding or correcting tests |
| `refactor` | No behavior change, code restructure |
| `chore` | Build, deps, tooling |

**Examples:**

```
feat: add refetchInterval polling support

Signed-off-by: Jane Doe <jane@example.com>
```

```
fix: prevent stale closure in retry loop

Without this, the retry count captured the wrong iteration variable,
causing retries to always use the initial attempt count.

Signed-off-by: Jane Doe <jane@example.com>
```

Keep the subject line under 72 characters. Use the body to explain *why*, not *what*.

---

## Design Principles

These values guide every decision in Kvale. When in doubt, refer back to them.

1. **Zero dependencies.** Kvale ships nothing except itself. Every dependency is a liability — for security, for maintenance, for bundle size.

2. **No providers.** `createCache()` returns a plain object. No React context patterns, no wrapper components, no global singletons users didn't choose.

3. **Runes-native.** `$state` and `$effect` only. If your contribution uses `writable()`, `readable()`, or `$:`, it does not belong here.

4. **The core is framework-agnostic.** `src/core/` runs in Node, Deno, Bun, or a browser without Svelte. This must remain true.

5. **Small surface area.** The API should shrink, not grow. Every new option is a permanent cost. Prefer solving problems in userland when possible.

6. **Correctness over convenience.** One right way to do something is better than three convenient ways that are subtly broken in edge cases.

7. **Transparent and auditable.** The full codebase should be readable in an afternoon. No magic. No hidden behaviors. Consistent with Complexia's commitment to safe, inspectable software.

---

## Questions

- **General discussion:** Open a [GitHub Discussion](https://github.com/qkal/kvale/discussions)
- **Bugs and feature requests:** Open a [GitHub Issue](https://github.com/qkal/kvale/issues)
- **Direct questions:** Reach out to [Kal](https://github.com/qkal)

We are a small team. We will respond as promptly as we can — please be patient.

---

MIT © Kal, founder of [Complexia](https://complexia.org)
