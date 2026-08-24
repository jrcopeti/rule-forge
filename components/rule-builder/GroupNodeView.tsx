"use client";

/**
 * One AND/OR group, and everything inside it.
 *
 * This is the recursive component. A group renders its children; a child that
 * is itself a group renders `<GroupNodeView>` again. That is the entire trick,
 * and it is why arbitrarily deep nesting needs no extra code.
 *
 * TODO: implement.
 *  1. Render the group header: an AND/OR toggle, and a delete button unless
 *     this is the root.
 *  2. Map over `node.children`. Branch on `child.kind`: a condition renders
 *     `<ConditionRow>`, a group renders `<GroupNodeView>` with `depth + 1`.
 *  3. Render `+ condition` and `+ group` buttons at the bottom of the group.
 *  4. Indent by depth so the nesting is legible. Alternate the background
 *     tint per level rather than adding margin alone; deep trees get lost
 *     otherwise.
 */

import type { GroupNode, Schema } from "@/lib/rule-engine/types";
import type { RuleAction } from "@/hooks/useRuleTree";

export type GroupNodeViewProps = {
  node: GroupNode;
  schema: Schema;
  depth: number;
  isRoot: boolean;
  dispatch: (action: RuleAction) => void;
};

export function GroupNodeView(_props: GroupNodeViewProps) {
  return <div>TODO: GroupNodeView</div>;
}
