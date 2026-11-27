"use client";

/**
 * The operator dropdown. Its options depend entirely on the type of the field
 * selected to its left, which is what makes the builder feel type-aware.
 *
 * TODO: implement.
 *  1. Call `operatorsForField(field)` for the options, never a hardcoded list.
 *  2. Label each option with `OPERATOR_LABELS[operator]`.
 *  3. When the field changes type, the parent resets the operator. This
 *     component only has to render what it is given.
 */

import type { FieldDef, Operator } from "@/lib/rule-engine/types";

export type OperatorSelectProps = {
  field: FieldDef;
  value: Operator;
  onChange: (operator: Operator) => void;
};

export function OperatorSelect(_props: OperatorSelectProps) {
  return <select disabled aria-label="Operator" />;
}
