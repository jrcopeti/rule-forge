/**
 * Turning a comparison into a sentence a human can read.
 *
 * The evaluator produces the verdict; this module produces the wording. Keeping
 * them apart means the evaluator's tests assert on logic rather than on commas,
 * and the wording can be reworked later without touching the engine.
 *
 * The sentence the UI shows looks like one of these:
 *
 *     cart.total was 80
 *     cart.total was 80, expected > 100
 *     customer.tier was "silver", expected "gold"
 *     customer.tier was "bronze", expected one of ["gold", "platinum"]
 *     cart.total was 80, expected between 100 and 200
 *     product.category was missing, expected to contain "sneak"
 */

import type { Operator } from "./types";

/** Render a value the way it should appear inside an explanation. */
export function formatValue(value: unknown): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(", ")}]`;
  }
  return String(value);
}

/** The part of the sentence that follows the word "expected". */
export function formatExpectation(operator: Operator, expected: unknown): string {
  switch (operator) {
    case "eq":
      return formatValue(expected);
    case "neq":
      return `anything but ${formatValue(expected)}`;
    case "contains":
      return `to contain ${formatValue(expected)}`;
    case "startsWith":
      return `to start with ${formatValue(expected)}`;
    case "in":
      return `one of ${formatValue(expected)}`;
    case "gt":
      return `> ${formatValue(expected)}`;
    case "gte":
      return `>= ${formatValue(expected)}`;
    case "lt":
      return `< ${formatValue(expected)}`;
    case "lte":
      return `<= ${formatValue(expected)}`;
    case "between": {
      const [low, high] = Array.isArray(expected) ? expected : [];
      return `between ${formatValue(low)} and ${formatValue(high)}`;
    }
    case "isTrue":
      return "true";
    case "isFalse":
      return "false";
    case "before":
      return `before ${formatValue(expected)}`;
    case "after":
      return `after ${formatValue(expected)}`;
    default: {
      // If this line stops compiling, an operator was added to types.ts and
      // never given a phrasing here.
      const exhaustive: never = operator;
      throw new Error(`Unhandled operator: ${String(exhaustive)}`);
    }
  }
}

/**
 * The full sentence. A passing condition does not need to state what was
 * expected, since it got it.
 */
export function buildExplain(
  field: string,
  operator: Operator,
  actual: unknown,
  expected: unknown,
  passed: boolean,
): string {
  const observed = `${field} was ${formatValue(actual)}`;
  if (passed) return observed;
  return `${observed}, expected ${formatExpectation(operator, expected)}`;
}
