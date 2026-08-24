import { describe, expect, it } from "vitest";

import { cartSchema } from "@/lib/demo/cart-schema";
import { isRuleValid, issuesByNode, validateRule } from "./validate";
import type { ConditionNode, GroupNode, Operator } from "./types";

function condition(
  id: string,
  field: string,
  operator: Operator,
  value: unknown,
): ConditionNode {
  return { id, kind: "condition", field, operator, value };
}

function wrap(...children: GroupNode["children"]): GroupNode {
  return { id: "root", kind: "group", op: "AND", children };
}

/**
 * Only `nodeId` is asserted exactly. Wording is matched loosely on purpose, so
 * the messages can be reworded without breaking the suite. The two messages
 * spelled out in `validate.ts` are the exceptions.
 */
describe("validateRule", () => {
  it("reports nothing for a well-formed rule", () => {
    const rule = wrap(
      condition("a", "cart.total", "gt", 50),
      condition("b", "customer.tier", "eq", "gold"),
    );
    expect(validateRule(rule, cartSchema)).toEqual([]);
  });

  it("flags a field that is not in the schema", () => {
    const rule = wrap(condition("a", "cart.totl", "gt", 50));
    const issues = validateRule(rule, cartSchema);
    expect(issues).toHaveLength(1);
    expect(issues[0].nodeId).toBe("a");
    expect(issues[0].message).toBe('Unknown field "cart.totl"');
  });

  it("flags an operator the field type does not support", () => {
    const rule = wrap(condition("a", "cart.total", "contains", "5"));
    const issues = validateRule(rule, cartSchema);
    expect(issues).toHaveLength(1);
    expect(issues[0].nodeId).toBe("a");
    expect(issues[0].message).toMatch(/contains/);
  });

  it("flags a missing value on a single-value operator", () => {
    const rule = wrap(condition("a", "cart.total", "gt", undefined));
    expect(validateRule(rule, cartSchema)).toHaveLength(1);
  });

  it("treats an empty string as a missing value", () => {
    const rule = wrap(condition("a", "product.category", "contains", ""));
    expect(validateRule(rule, cartSchema)).toHaveLength(1);
  });

  it("requires a non-empty array for a list operator", () => {
    expect(validateRule(wrap(condition("a", "customer.tier", "in", [])), cartSchema))
      .toHaveLength(1);
    expect(
      validateRule(wrap(condition("a", "customer.tier", "in", "gold")), cartSchema),
    ).toHaveLength(1);
    expect(
      validateRule(
        wrap(condition("a", "customer.tier", "in", ["gold", "platinum"])),
        cartSchema,
      ),
    ).toEqual([]);
  });

  it("requires exactly two entries for a range operator", () => {
    expect(
      validateRule(wrap(condition("a", "cart.total", "between", [10])), cartSchema),
    ).toHaveLength(1);
    expect(
      validateRule(
        wrap(condition("a", "cart.total", "between", [10, 20, 30])),
        cartSchema,
      ),
    ).toHaveLength(1);
    expect(
      validateRule(wrap(condition("a", "cart.total", "between", [10, 20])), cartSchema),
    ).toEqual([]);
  });

  it("asks for no value at all on a boolean operator", () => {
    const rule = wrap(condition("a", "customer.isFirstPurchase", "isTrue", undefined));
    expect(validateRule(rule, cartSchema)).toEqual([]);
  });

  it("flags an enum value that is not one of the options", () => {
    const rule = wrap(condition("a", "customer.tier", "eq", "golden"));
    const issues = validateRule(rule, cartSchema);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toMatch(/golden/);
  });

  it("flags a non-numeric value on a number field", () => {
    expect(
      validateRule(wrap(condition("a", "cart.total", "gt", "fifty")), cartSchema),
    ).toHaveLength(1);
    expect(
      validateRule(wrap(condition("a", "cart.total", "gt", Number.NaN)), cartSchema),
    ).toHaveLength(1);
  });

  it("flags an empty group", () => {
    const rule = wrap({ id: "inner", kind: "group", op: "OR", children: [] });
    const issues = validateRule(rule, cartSchema);
    expect(issues).toHaveLength(1);
    expect(issues[0].nodeId).toBe("inner");
    expect(issues[0].message).toBe("Group is empty");
  });

  it("descends into nested groups", () => {
    const rule = wrap({
      id: "inner",
      kind: "group",
      op: "OR",
      children: [condition("deep", "nope.nope", "eq", "x")],
    });
    expect(validateRule(rule, cartSchema)[0].nodeId).toBe("deep");
  });

  it("reports every problem, not only the first", () => {
    const rule = wrap(
      condition("a", "nope.nope", "eq", "x"),
      condition("b", "cart.total", "gt", undefined),
      { id: "inner", kind: "group", op: "OR", children: [] },
    );
    expect(validateRule(rule, cartSchema).map((issue) => issue.nodeId).sort()).toEqual(
      ["a", "b", "inner"],
    );
  });
});

describe("isRuleValid", () => {
  it("is true when there are no issues", () => {
    expect(isRuleValid(wrap(condition("a", "cart.total", "gt", 50)), cartSchema)).toBe(
      true,
    );
  });

  it("is false as soon as there is one", () => {
    expect(isRuleValid(wrap(condition("a", "nope", "eq", 1)), cartSchema)).toBe(false);
  });
});

describe("issuesByNode", () => {
  it("groups issues under their node id", () => {
    const grouped = issuesByNode([
      { nodeId: "a", message: "first" },
      { nodeId: "b", message: "second" },
      { nodeId: "a", message: "third" },
    ]);
    expect(Object.keys(grouped).sort()).toEqual(["a", "b"]);
    expect(grouped.a).toHaveLength(2);
  });

  it("returns an empty object for an empty list", () => {
    expect(issuesByNode([])).toEqual({});
  });
});
