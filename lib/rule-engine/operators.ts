/**
 * The operator catalogue: which operators a field type accepts, how they are
 * labelled in the UI, and how many values each one needs.
 *
 * This module is the reason the builder feels type-aware. Pick a number field
 * and you are offered `>` and `between`; pick an enum and you are offered
 * `is one of` instead. The UI does not hardcode any of that, it asks here.
 */

import type { FieldDef, FieldType, Operator } from "./types";

/**
 * How many values an operator needs from the user.
 *
 * - `none`   the operator is self contained (`is true`)
 * - `single` one value (`> 50`, `is "gold"`)
 * - `list`   an array of values (`is one of ["gold", "platinum"]`)
 * - `range`  exactly two values, lower and upper (`between 10 and 20`)
 */
export type ValueArity = "none" | "single" | "list" | "range";

/** Which operators each field type may use. Order is the dropdown order. */
export const OPERATORS_BY_TYPE: Record<FieldType, readonly Operator[]> = {
  string: ["eq", "neq", "contains", "startsWith", "in"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte", "between"],
  boolean: ["isTrue", "isFalse"],
  date: ["before", "after", "between"],
  enum: ["eq", "neq", "in"],
};

/** UI labels. Kept short: these render inside a dropdown between two inputs. */
export const OPERATOR_LABELS: Record<Operator, string> = {
  eq: "is",
  neq: "is not",
  contains: "contains",
  startsWith: "starts with",
  in: "is one of",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  between: "between",
  isTrue: "is true",
  isFalse: "is false",
  before: "before",
  after: "after",
};

export const OPERATOR_ARITY: Record<Operator, ValueArity> = {
  eq: "single",
  neq: "single",
  contains: "single",
  startsWith: "single",
  in: "list",
  gt: "single",
  gte: "single",
  lt: "single",
  lte: "single",
  between: "range",
  isTrue: "none",
  isFalse: "none",
  before: "single",
  after: "single",
};

/** The operators offered for a given field. */
export function operatorsForField(field: FieldDef): readonly Operator[] {
  return OPERATORS_BY_TYPE[field.type];
}

/** Whether an operator is legal for a field type. Used by `validate.ts`. */
export function isOperatorValidFor(
  type: FieldType,
  operator: Operator,
): boolean {
  return OPERATORS_BY_TYPE[type].includes(operator);
}

/**
 * The operator to fall back to when the user switches a condition to a field
 * of a different type and the current operator no longer applies. Always the
 * first one offered for the new type.
 */
export function defaultOperatorFor(field: FieldDef): Operator {
  return OPERATORS_BY_TYPE[field.type][0];
}

/** Look a field up in a schema by its dotted key. */
export function findField(
  schema: readonly FieldDef[],
  key: string,
): FieldDef | undefined {
  return schema.find((field) => field.key === key);
}
