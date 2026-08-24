# rule-forge

A visual builder for condition trees, with an evaluator that explains itself.

Most rule builders answer one question: did the rule match, yes or no. This one
answers the question you actually have when it says no — **which condition
failed, and what was the value it saw**.

```
┌─ BUILDER ────────────────────────────┐  ┌─ LIVE JSON ───────────────┐
│  ╔═ Group  [ AND ▾] ══════════════╗  │  │ {                         │
│  ║  [cart.total ▾] [> ▾] [50]     ║  │  │  "op": "AND",             │
│  ║  [customer.tier ▾] [= ▾][gold] ║  │  │  "children": [ ... ]      │
│  ║  [+ condition]  [+ group]      ║  │  │ }                         │
│  ╚════════════════════════════════╝  │  └───────────────────────────┘
└──────────────────────────────────────┘
┌─ EVALUATE ──────────────────────────────────────────────────────────┐
│ [ Silver customer, 80€, sneakers ▾ ]      Group (AND)  ✗ NO MATCH   │
│   ├── cart.total > 50            ✓  was 80                          │
│   └── customer.tier = "gold"     ✗  was "silver"   ← failed here    │
└─────────────────────────────────────────────────────────────────────┘
```

## Why

Promotion engines, feature flag targeting, fraud rules, alert routing, workflow
automation, audience segmentation: every B2B product ends up growing a screen
where a non-engineer composes `if this and this then that`. Most are built once,
in a hurry, and are impossible to debug from the outside.

The interesting part of that screen is not the composing. It is the moment the
rule does not fire and nobody can say why.

## Status

Under construction, in the open. The engine is being built before the interface.

- [x] Type model, operator catalogue, explanation wording, JSON serialization
- [ ] Immutable tree operations
- [ ] Evaluator with per-node blame
- [ ] Schema validation
- [ ] Builder UI
- [ ] Evaluation panel

## How it works

A rule is a recursive tree of two node kinds:

```ts
type RuleNode =
  | { id: string; kind: "group"; op: "AND" | "OR"; children: RuleNode[] }
  | { id: string; kind: "condition"; field: string; operator: Operator; value: unknown };
```

Evaluating it does not return a boolean. It returns a mirror of that tree where
every node reports whether it passed, what the record actually held, and a
sentence explaining the comparison. Groups additionally carry `blamed`: the ids
of the children responsible for the failure. A failing `AND` blames the children
that failed; a failing `OR` blames all of them, since none passed.

That trace is what the evaluation panel renders.

## Architecture

```
lib/rule-engine/   pure, no React, no Next — the extractable part
  types.ts         the data model
  operators.ts     which operators each field type accepts
  tree.ts          immutable find / insert / update / remove
  evaluate.ts      the evaluator and its trace
  validate.ts      structural checks against a schema
  explain.ts       comparison to sentence
  serialize.ts     to and from JSON, with structural parsing
lib/demo/          the e-commerce schema and sample records used by the demo
hooks/             useRuleTree: reducer plus undo/redo history
components/        the builder UI
```

The engine is deliberately free of any framework import. Undo and redo are
nearly free because every tree operation already returns a new tree rather than
mutating the old one.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # the engine suite
npm run typecheck
```

## License

MIT
