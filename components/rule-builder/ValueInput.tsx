"use client";

/**
 * The value control. Renders a different input depending on the field type and
 * the operator's arity.
 *
 * TODO: implement. The matrix, from `OPERATOR_ARITY`:
 *
 *   arity "none"                  render nothing at all
 *   arity "range"                 two inputs, "and" between them
 *   arity "list"                  a multi-select for enum fields, a
 *                                 comma-separated text input otherwise
 *   arity "single", enum field    a select of `field.options`
 *   arity "single", number field  <input type="number">, and show `field.unit`
 *   arity "single", date field    <input type="date">
 *   arity "single", string field  <input type="text">
 *
 * Numbers must reach the tree as numbers, not strings. An input's value is
 * always a string, so convert on the way out, and send `undefined` rather than
 * `NaN` when the box is empty.
 */

import type { FieldDef, Operator } from "@/lib/rule-engine/types";

export type ValueInputProps = {
  field: FieldDef;
  operator: Operator;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function ValueInput(_props: ValueInputProps) {
  return <input disabled aria-label="Value" />;
}
