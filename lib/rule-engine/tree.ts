/**
 * Immutable operations over the rule tree.
 *
 * ---------------------------------------------------------------------------
 * TODO: implement this file. `tree.test.ts` is the specification.
 * Run `npm run test:watch` and make it green.
 * ---------------------------------------------------------------------------
 *
 * Every function here is pure. None of them mutates its input, and each returns
 * a brand new tree. That single rule is what makes undo/redo in `useRuleTree`
 * almost free later: keeping a history is just keeping an array of the trees
 * these functions already returned.
 *
 * There is no React here, and there is no id generation here either (see
 * `id.ts`). Callers pass fully formed nodes in.
 *
 * The shape you will keep reaching for:
 *
 *     if (node.kind === "condition") return <the leaf case>;
 *     return { ...node, children: node.children.map(recurse) };
 *
 * TypeScript narrows `node` to `ConditionNode` inside that first branch and to
 * `GroupNode` after it, because `RuleNode` is a discriminated union on `kind`.
 * Lean on that instead of casting.
 */

import type { ConditionNode, GroupNode, RuleNode } from "./types";

/**
 * The fields of a node that may be changed after creation. `id` and `kind` are
 * deliberately absent: a condition never becomes a group, and an id is forever.
 */
export type NodePatch =
  | Partial<Pick<ConditionNode, "field" | "operator" | "value">>
  | Partial<Pick<GroupNode, "op" | "children">>;

/**
 * Find a node anywhere in the tree by id.
 *
 * 1. If `root.id` matches, return `root`.
 * 2. If `root` is a condition, there is nothing below it, return undefined.
 * 3. Otherwise search each child in turn and return the first hit.
 *
 * Returns undefined when no node carries that id.
 */
export function findNode(root: RuleNode, id: string): RuleNode | undefined {
  throw new Error("TODO: implement findNode");
}

/**
 * Append `node` to the children of the group identified by `parentId`.
 *
 * 1. Walk the tree looking for a group whose id is `parentId`.
 * 2. When found, return a copy of it with `node` appended to `children`.
 * 3. Groups that are not the target still need copying if any descendant
 *    changed, which the recursive map handles for you.
 * 4. If `parentId` does not exist, return the tree unchanged.
 *
 * A condition is never a valid parent; conditions have no children.
 */
export function insertNode(
  root: GroupNode,
  parentId: string,
  node: RuleNode,
): GroupNode {
  throw new Error("TODO: implement insertNode");
}

/**
 * Apply a partial update to the node with the given id.
 *
 * 1. Find the node by id, exactly as `findNode` does, but rebuild on the way.
 * 2. Merge: `{ ...node, ...patch }`.
 * 3. Everything not on the path to that node must come back referentially
 *    identical. Only rebuild the branches you actually walk into.
 *
 * If the id does not exist, return the tree unchanged.
 */
export function updateNode(
  root: GroupNode,
  id: string,
  patch: NodePatch,
): GroupNode {
  throw new Error("TODO: implement updateNode");
}

/**
 * Remove the node with the given id.
 *
 * 1. Filter it out of whichever group holds it.
 * 2. Recurse into the remaining children so nested targets are found too.
 * 3. The root itself can never be removed. If `id === root.id`, return the
 *    tree unchanged.
 *
 * Removing a group removes everything inside it.
 */
export function removeNode(root: GroupNode, id: string): GroupNode {
  throw new Error("TODO: implement removeNode");
}

/**
 * Count every node in the tree, root included. Used by the UI for an empty
 * state and by the tests as a cheap structural assertion.
 */
export function countNodes(root: RuleNode): number {
  throw new Error("TODO: implement countNodes");
}
