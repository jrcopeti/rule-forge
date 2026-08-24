# rule-forge

A visual builder for condition trees with an explaining evaluator. See
`README.md` for what it does and why.

## Language

Everything in this repository is written in English: code, comments, test
descriptions, UI copy, documentation, commit messages, branch names and pull
request titles. No exceptions.

## Conventions

- Next.js App Router, no `src/` directory. Routes in `app/`, shared code in
  `lib/`, `hooks/`, `components/`.
- Tailwind v4. No component library.
- Vitest, with `.test.ts` files colocated next to the module they cover.
- Path alias `@/*` resolves to the repository root, in both tsconfig and vitest.
- Conventional Commits, imperative mood.

## Architectural rules

1. **`lib/rule-engine/` imports nothing from React, Next or Tailwind.** It is
   meant to be extracted into a standalone package later. Anything that needs
   the browser belongs in `hooks/` or `components/`.
2. **Tree operations are pure and immutable.** They never mutate their input and
   always return a new tree. Undo/redo depends on this.
3. **Ids are minted at the edge**, by `useRuleTree` via `createId()`. Functions
   in `tree.ts` never generate ids.
4. **A half-built rule must never throw.** The user is mid-edit on every
   keystroke. Report problems as data through `validate.ts` instead.
5. **The evaluator returns a trace, not a boolean.** Preserving `blamed` and
   `explain` is the point of the project; do not simplify them away.

## Work in progress

Several modules are intentionally unimplemented stubs that throw
`TODO: implement ...`. Their tests are already written and failing, and those
tests are the specification. Do not implement them unless asked — they are
exercises.
