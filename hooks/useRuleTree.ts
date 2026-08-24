"use client";

/**
 * The builder's state: the current rule, plus undo and redo.
 *
 * ---------------------------------------------------------------------------
 * TODO: implement this file.
 * ---------------------------------------------------------------------------
 *
 * There is a reason this is the only stateful module in the project. Every
 * function in `lib/rule-engine/tree.ts` already returns a new tree instead of
 * mutating the old one, which means a history is nothing more than an array of
 * trees those functions handed back. Undo is popping one off. That is the
 * payoff for having kept the engine pure.
 *
 * Shape of the state:
 *
 *     { past: GroupNode[], present: GroupNode, future: GroupNode[] }
 *
 * Every action that changes the rule pushes `present` onto `past`, sets the new
 * tree as `present`, and clears `future`. Undo moves one tree from `past` to
 * `future`; redo does the reverse.
 *
 * Ids are minted here, at the edge, with `createId()`. The tree functions never
 * generate anything.
 */

import type { LogicalOp, GroupNode, RuleNode } from "@/lib/rule-engine/types";
import type { NodePatch } from "@/lib/rule-engine/tree";

export type RuleAction =
  /** Append an empty condition to the given group, defaulted to the first schema field. */
  | { type: "addCondition"; parentId: string }
  /** Append an empty nested group to the given group. */
  | { type: "addGroup"; parentId: string }
  /** Patch a condition or a group in place. */
  | { type: "update"; id: string; patch: NodePatch }
  /** Flip a group between AND and OR. */
  | { type: "setGroupOp"; id: string; op: LogicalOp }
  /** Delete a node and everything under it. */
  | { type: "remove"; id: string }
  /** Throw the rule away and start over. */
  | { type: "reset"; tree: GroupNode };

export type UseRuleTree = {
  tree: GroupNode;
  dispatch: (action: RuleAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

/**
 * 1. Hold `{ past, present, future }` in a `useReducer`.
 * 2. Write a reducer that maps each `RuleAction` onto one of the tree functions
 *    and wraps the result in the history bookkeeping described above.
 * 3. A new condition needs sensible defaults: the first field in the schema,
 *    `defaultOperatorFor` that field, and an undefined value. It will be
 *    invalid until the user fills it in, and that is fine, `validate.ts`
 *    exists precisely so a half-built condition never crashes anything.
 * 4. Return the object above. `canUndo` is `past.length > 0`.
 *
 * Keep the reducer itself pure. Anything to do with the browser, localStorage
 * included, belongs in an effect, not in here.
 */
export function useRuleTree(initial: GroupNode): UseRuleTree {
  throw new Error("TODO: implement useRuleTree");
}

/** An empty starting rule: one AND group with nothing in it. */
export function emptyRule(id: string): GroupNode {
  return { id, kind: "group", op: "AND", children: [] };
}

export type { RuleNode };
