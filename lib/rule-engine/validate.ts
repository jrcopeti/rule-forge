/**
 * Structural validation of a rule against a schema.
 *
 * ---------------------------------------------------------------------------
 * TODO: implement this file. `validate.test.ts` is the specification.
 * ---------------------------------------------------------------------------
 *
 * A rule under construction is almost always invalid: the user has added a
 * condition and not yet chosen a value. That is normal and must never throw.
 * This module reports problems as data so the UI can mark the offending row
 * and disable the evaluate button, and so `evaluate` can stay focused on
 * comparing values rather than defending itself.
 */

import type { RuleNode, Schema } from "./types";

export type ValidationIssue = {
  /** The node the problem belongs to, so the UI can highlight that row. */
  nodeId: string;
  /** Shown to the user as-is. Write it in plain English. */
  message: string;
};

/**
 * Collect every problem in the tree. An empty array means the rule is ready to
 * evaluate.
 *
 * Walk every node and check, in this order:
 *
 * 1. Condition points at a field that is not in the schema
 *    -> `Unknown field "cart.totl"`
 * 2. Operator is not allowed for that field's type (use `isOperatorValidFor`)
 *    -> `Operator "contains" cannot be used with a number field`
 * 3. The value does not match the operator's arity (use `OPERATOR_ARITY`)
 *    -> `single`: value must not be undefined or an empty string
 *    -> `list`:   value must be a non-empty array
 *    -> `range`:  value must be an array of exactly two entries
 *    -> `none`:   nothing to check
 * 4. For an enum field, a value that is not one of `options`
 *    -> `"golden" is not one of: bronze, silver, gold, platinum`
 * 5. For a number field, a value that is not a finite number
 * 6. An empty group -> `Group is empty`
 *
 * Report every issue found, not just the first. Users fix forms faster when
 * they can see all of them at once.
 */
export function validateRule(rule: RuleNode, schema: Schema): ValidationIssue[] {
  throw new Error("TODO: implement validateRule");
}

/**
 * Convenience wrapper for the UI: is this whole rule safe to evaluate?
 */
export function isRuleValid(rule: RuleNode, schema: Schema): boolean {
  throw new Error("TODO: implement isRuleValid");
}

/**
 * Group the issues by node id so a component can look up its own row in O(1)
 * instead of filtering the whole list on every render.
 */
export function issuesByNode(
  issues: readonly ValidationIssue[],
): Record<string, ValidationIssue[]> {
  throw new Error("TODO: implement issuesByNode");
}
