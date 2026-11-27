"use client";

/**
 * The field dropdown: the first of the three controls in a condition row.
 *
 * Deliberately dumb. It knows how to list a schema and report a choice, and
 * nothing about what happens next. Resetting the operator when the field type
 * changes is the parent's job, in `ConditionRow`.
 */

import type { FieldDef, Schema } from "@/lib/rule-engine/types";

export type FieldSelectProps = {
  schema: Schema;
  value: string;
  onChange: (field: FieldDef) => void;
};

export function FieldSelect({ schema, value, onChange }: FieldSelectProps) {
  return (
    <select
      aria-label="Field"
      className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      value={value}
      onChange={(event) => {
        const field = schema.find((entry) => entry.key === event.target.value);
        if (field) onChange(field);
      }}
    >
      {schema.map((field) => (
        <option key={field.key} value={field.key}>
          {field.label}
        </option>
      ))}
    </select>
  );
}
