/**
 * Turning a rule into JSON and back.
 *
 * The JSON produced here is the actual product of this app: it is what a host
 * application would persist and later execute on its own backend. It is also
 * what the right-hand panel displays live as the user builds.
 *
 * `fromJSON` cannot trust its input, since it may come from a file, an API or
 * a pasted string, so it validates structurally before returning. It checks
 * shape only, not whether the fields exist in a schema. That is
 * `validate.ts`'s job.
 */

import { OPERATOR_ARITY } from "./operators";
import type { GroupNode, Operator, RuleNode } from "./types";

/** Pretty-printed JSON, the form shown in the UI and copied to the clipboard. */
export function toJSON(rule: RuleNode): string {
  return JSON.stringify(rule, null, 2);
}

export class InvalidRuleJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRuleJsonError";
  }
}

/** Parse and structurally validate a serialized rule. Throws on bad input. */
export function fromJSON(text: string): RuleNode {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new InvalidRuleJsonError("Input is not valid JSON");
  }
  return parseNode(parsed, "$");
}

const KNOWN_OPERATORS = new Set(Object.keys(OPERATOR_ARITY));

function parseNode(value: unknown, path: string): RuleNode {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new InvalidRuleJsonError(`${path} is not an object`);
  }

  const node = value as Record<string, unknown>;

  if (typeof node.id !== "string" || node.id.length === 0) {
    throw new InvalidRuleJsonError(`${path}.id must be a non-empty string`);
  }

  if (node.kind === "group") {
    if (node.op !== "AND" && node.op !== "OR") {
      throw new InvalidRuleJsonError(`${path}.op must be "AND" or "OR"`);
    }
    if (!Array.isArray(node.children)) {
      throw new InvalidRuleJsonError(`${path}.children must be an array`);
    }
    return {
      id: node.id,
      kind: "group",
      op: node.op,
      children: node.children.map((child, index) =>
        parseNode(child, `${path}.children[${index}]`),
      ),
    } satisfies GroupNode;
  }

  if (node.kind === "condition") {
    if (typeof node.field !== "string" || node.field.length === 0) {
      throw new InvalidRuleJsonError(`${path}.field must be a non-empty string`);
    }
    if (
      typeof node.operator !== "string" ||
      !KNOWN_OPERATORS.has(node.operator)
    ) {
      throw new InvalidRuleJsonError(
        `${path}.operator is not a known operator: ${String(node.operator)}`,
      );
    }
    return {
      id: node.id,
      kind: "condition",
      field: node.field,
      operator: node.operator as Operator,
      value: node.value,
    };
  }

  throw new InvalidRuleJsonError(
    `${path}.kind must be "group" or "condition", got ${String(node.kind)}`,
  );
}
