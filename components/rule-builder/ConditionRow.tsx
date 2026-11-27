"use client";

/**
 * One condition: field, operator, value, delete.
 *
 * TODO: implement.
 *  1. Lay the three controls out in a row: `<FieldSelect>`, `<OperatorSelect>`,
 *     `<ValueInput>`.
 *  2. Changing the field is the interesting case. If the new field has a
 *     different type, the current operator may no longer be legal, so dispatch
 *     an update that sets the field, `defaultOperatorFor(newField)` and clears
 *     the value in one action. Leaving a stale operator behind is the bug this
 *     component exists to avoid.
 *  3. Show any validation issues for this node underneath, in red.
 */

import type { ConditionNode, Schema } from "@/lib/rule-engine/types";
import type { ValidationIssue } from "@/lib/rule-engine/validate";
import type { RuleAction } from "@/hooks/useRuleTree";

export type ConditionRowProps = {
  node: ConditionNode;
  schema: Schema;
  issues: readonly ValidationIssue[];
  dispatch: (action: RuleAction) => void;
};

export function ConditionRow(_props: ConditionRowProps) {
  return <div>TODO: ConditionRow</div>;
}
