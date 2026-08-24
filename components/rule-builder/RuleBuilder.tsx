"use client";

/**
 * The root of the builder. Owns nothing itself: it wires `useRuleTree` to the
 * three panels and passes the pieces down.
 *
 * TODO: implement.
 *  1. Call `useRuleTree(emptyRule("root"))`.
 *  2. Run `validateRule` on every render and pass the result down via
 *     `issuesByNode`, so each row can look up its own problems in O(1).
 *  3. Render `<GroupNodeView>` for the root, `<JsonPanel>` beside it and
 *     `<EvalPanel>` underneath.
 *  4. Wire undo/redo buttons to the hook.
 */

import type { Schema } from "@/lib/rule-engine/types";

export type RuleBuilderProps = {
  schema: Schema;
};

export function RuleBuilder({ schema }: RuleBuilderProps) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      TODO: RuleBuilder ({schema.length} fields available)
    </div>
  );
}
