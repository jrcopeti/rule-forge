/**
 * The evaluator. This is the heart of the project.
 *
 * ---------------------------------------------------------------------------
 * TODO: implement this file. `evaluate.test.ts` is the specification.
 * Run `npm run test:watch` and make it green.
 * ---------------------------------------------------------------------------
 *
 * Most rule engines answer one question: did the rule match, yes or no. This
 * one answers a second, more useful question: if it did not match, which
 * condition is responsible and what was the actual value.
 *
 * So `evaluate` does not return a boolean. It returns an `EvalResult` that
 * mirrors the rule tree node for node, and the UI walks the two together.
 */

import { buildExplain } from "./explain";
import type {
  ConditionNode,
  DataRecord,
  EvalResult,
  GroupNode,
  RuleNode,
} from "./types";

/**
 * Read a dotted path out of a nested record.
 *
 *     resolvePath({ customer: { tier: "gold" } }, "customer.tier")  // "gold"
 *     resolvePath({ cart: {} }, "cart.total")                       // undefined
 *
 * 1. Split the path on ".".
 * 2. Walk the segments, descending one level per segment.
 * 3. Bail out and return undefined the moment the current value stops being a
 *    non-null object, so a missing branch never throws.
 *
 * Exported because it is worth testing on its own.
 *
 * This is exactly the bracket-access-with-a-variable-key shape: you cannot
 * write `record.segment`, you have to write `record[segment]`, and the value
 * coming back is `unknown` until you narrow it.
 */
export function resolvePath(record: DataRecord, path: string): unknown {
  throw new Error("TODO: implement resolvePath");
}

/**
 * Evaluate one condition against a record.
 *
 * 1. Resolve the field to get `actual`.
 * 2. Switch on `condition.operator` and compute `passed`.
 * 3. Build `explain` by calling `buildExplain` from `./explain`. The wording
 *    is already written and tested; do not hand-roll the sentence here.
 * 4. Return the full `ConditionResult`, passing or failing.
 *
 * Notes that will save you time:
 *
 * - `in` expects `condition.value` to be an array, `between` expects a
 *   two-element array `[low, high]`, inclusive on both ends. `isTrue` and
 *   `isFalse` ignore `condition.value` entirely. See `OPERATOR_ARITY`.
 * - Date operators compare ISO date strings. Parse both sides with `Date` and
 *   compare the timestamps rather than the strings.
 * - A missing field (`actual === undefined`) fails every operator except
 *   `neq`. Do not throw, a half-built rule is evaluated on every keystroke.
 * - End the switch with a `default` that assigns the operator to a variable of
 *   type `never`. If you later add an operator to `types.ts` and forget it
 *   here, that line stops compiling. That is the compiler doing your code
 *   review for you.
 */
export function evaluateCondition(
  condition: ConditionNode,
  record: DataRecord,
): EvalResult {
  throw new Error("TODO: implement evaluateCondition");
}

/**
 * Evaluate a group against a record.
 *
 * 1. Evaluate every child first, recursively, keeping their results in order.
 * 2. `AND` passes when every child passed. `OR` passes when at least one did.
 * 3. Fill in `blamed`:
 *      - passing group  -> `[]`
 *      - failing AND    -> the ids of the children that failed
 *      - failing OR     -> the ids of all children, since none passed
 * 4. An empty group passes. A rule with no conditions excludes nobody.
 *
 * `blamed` holds ids of direct children only. The UI recurses to find the leaf.
 */
export function evaluateGroup(
  group: GroupNode,
  record: DataRecord,
): EvalResult {
  throw new Error("TODO: implement evaluateGroup");
}

/**
 * Public entry point. Dispatch on `kind` and hand off to one of the two
 * functions above.
 */
export function evaluate(rule: RuleNode, record: DataRecord): EvalResult {
  throw new Error("TODO: implement evaluate");
}
