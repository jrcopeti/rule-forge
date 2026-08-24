/**
 * Core type definitions for the rule engine.
 *
 * Everything else in `lib/rule-engine` is built on these types, and they are
 * deliberately free of any React or Next.js import so the engine can be
 * extracted into a standalone package later without a refactor.
 *
 * Two ideas carry the whole design:
 *
 * 1. A rule is a recursive tree. A group holds children, and a child may be
 *    another group. `RuleNode` is a discriminated union on `kind`.
 * 2. Evaluating a rule does not return a boolean. It returns a mirror of the
 *    tree where every node reports whether it passed and why. That trace is
 *    what lets the UI point at the exact condition that failed.
 */

/** The kinds of data a field can hold. Drives which operators are offered. */
export type FieldType = "string" | "number" | "boolean" | "date" | "enum";

/**
 * A single field the user can build conditions against, as declared by the
 * host application. Discriminated on `type` so that `enum` fields are the only
 * ones carrying `options`, and only `number` fields carry a `unit`.
 *
 * `key` is a dotted path into the record being evaluated, e.g. "customer.tier"
 * resolves to `record.customer.tier`.
 */
export type FieldDef =
  | { key: string; label: string; type: "string" }
  | { key: string; label: string; type: "number"; unit?: string }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "date" }
  | { key: string; label: string; type: "enum"; options: readonly string[] };

/** The full set of fields available to the builder. */
export type Schema = readonly FieldDef[];

export type StringOperator = "eq" | "neq" | "contains" | "startsWith" | "in";
export type NumberOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between";
export type BooleanOperator = "isTrue" | "isFalse";
export type DateOperator = "before" | "after" | "between";
export type EnumOperator = "eq" | "neq" | "in";

/**
 * Every operator the engine knows about. The per-type unions above are what
 * `operators.ts` uses to decide which subset a given field may use, which is
 * why changing the field in the UI re-populates the operator dropdown.
 */
export type Operator =
  | StringOperator
  | NumberOperator
  | BooleanOperator
  | DateOperator
  | EnumOperator;

/** How a group combines the results of its children. */
export type LogicalOp = "AND" | "OR";

/** A leaf: one field, one operator, one value. */
export type ConditionNode = {
  id: string;
  kind: "condition";
  /** Must match the `key` of a FieldDef in the active schema. */
  field: string;
  operator: Operator;
  /**
   * Intentionally `unknown`. The static type of a condition's value depends on
   * the field it points at, which is only known at runtime, so the value is
   * checked by `validate.ts` and narrowed inside the evaluator instead.
   */
  value: unknown;
};

/** A branch: an AND/OR over any number of children, groups included. */
export type GroupNode = {
  id: string;
  kind: "group";
  op: LogicalOp;
  children: RuleNode[];
};

export type RuleNode = GroupNode | ConditionNode;

/** An arbitrary record the rule is evaluated against, e.g. a shopping cart. */
export type DataRecord = Record<string, unknown>;

/** The outcome of evaluating one condition, including why it went that way. */
export type ConditionResult = {
  id: string;
  kind: "condition";
  passed: boolean;
  /** What the evaluated record actually held at this field. */
  actual: unknown;
  /** What the rule asked for. */
  expected: unknown;
  /** Human readable, shown in the UI, e.g. `cart.total was 80, expected > 100`. */
  explain: string;
};

/** The outcome of evaluating one group. */
export type GroupResult = {
  id: string;
  kind: "group";
  op: LogicalOp;
  passed: boolean;
  children: EvalResult[];
  /**
   * Ids of the children responsible for this group failing. This is the field
   * that makes the whole project worth building: it is what the UI reads to
   * draw the `<- failed here` marker.
   *
   * - a passing group blames nobody
   * - a failing AND blames every child that failed
   * - a failing OR blames all of its children, since none of them passed
   */
  blamed: string[];
};

export type EvalResult = GroupResult | ConditionResult;
