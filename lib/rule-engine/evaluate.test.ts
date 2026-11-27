import { describe, expect, it } from "vitest";

import { evaluate, evaluateCondition, resolvePath } from "./evaluate";
import type {
  ConditionNode,
  ConditionResult,
  DataRecord,
  GroupNode,
  GroupResult,
  Operator,
} from "./types";

const cart: DataRecord = {
  cart: { total: 80, itemCount: 2 },
  customer: {
    tier: "silver",
    country: "DE",
    isFirstPurchase: false,
    signupDate: "2025-03-14",
  },
  product: { category: "sneakers" },
  coupon: { code: "" },
};

/** Build a one-off condition and evaluate it against the fixture cart. */
function check(
  field: string,
  operator: Operator,
  value: unknown,
  record: DataRecord = cart,
): ConditionResult {
  const condition: ConditionNode = {
    id: "c1",
    kind: "condition",
    field,
    operator,
    value,
  };
  return evaluateCondition(condition, record) as ConditionResult;
}

describe("resolvePath", () => {
  it("reads a nested value", () => {
    expect(resolvePath(cart, "customer.tier")).toBe("silver");
  });

  it("reads a top-level value", () => {
    expect(resolvePath({ total: 5 }, "total")).toBe(5);
  });

  it("returns undefined for a missing leaf", () => {
    expect(resolvePath(cart, "cart.discount")).toBeUndefined();
  });

  it("returns undefined for a missing branch instead of throwing", () => {
    expect(resolvePath(cart, "shipping.address.city")).toBeUndefined();
  });

  it("returns undefined when a segment is not an object", () => {
    expect(resolvePath(cart, "customer.tier.length")).toBeUndefined();
  });
});

describe("evaluateCondition: number operators", () => {
  it("gt passes above the threshold", () => {
    expect(check("cart.total", "gt", 50).passed).toBe(true);
  });

  it("gt fails at the threshold", () => {
    expect(check("cart.total", "gt", 80).passed).toBe(false);
  });

  it("gte passes at the threshold", () => {
    expect(check("cart.total", "gte", 80).passed).toBe(true);
  });

  it("lt and lte behave symmetrically", () => {
    expect(check("cart.total", "lt", 80).passed).toBe(false);
    expect(check("cart.total", "lte", 80).passed).toBe(true);
  });

  it("between is inclusive on both ends", () => {
    expect(check("cart.total", "between", [80, 100]).passed).toBe(true);
    expect(check("cart.total", "between", [50, 80]).passed).toBe(true);
    expect(check("cart.total", "between", [81, 100]).passed).toBe(false);
  });
});

describe("evaluateCondition: string and enum operators", () => {
  it("eq compares exactly", () => {
    expect(check("customer.tier", "eq", "silver").passed).toBe(true);
    expect(check("customer.tier", "eq", "gold").passed).toBe(false);
  });

  it("neq is the negation of eq", () => {
    expect(check("customer.tier", "neq", "gold").passed).toBe(true);
  });

  it("contains looks inside the string", () => {
    expect(check("product.category", "contains", "sneak").passed).toBe(true);
    expect(check("product.category", "contains", "boot").passed).toBe(false);
  });

  it("startsWith anchors at the beginning", () => {
    expect(check("product.category", "startsWith", "sneak").passed).toBe(true);
    expect(check("product.category", "startsWith", "eakers").passed).toBe(false);
  });

  it("in tests membership of an array", () => {
    expect(check("customer.tier", "in", ["gold", "silver"]).passed).toBe(true);
    expect(check("customer.tier", "in", ["gold", "platinum"]).passed).toBe(false);
  });

  it("in fails when the value is not an array", () => {
    expect(check("customer.tier", "in", "silver").passed).toBe(false);
  });
});

describe("evaluateCondition: boolean operators", () => {
  it("isTrue and isFalse read the field, ignoring the condition value", () => {
    expect(check("customer.isFirstPurchase", "isFalse", undefined).passed).toBe(true);
    expect(check("customer.isFirstPurchase", "isTrue", undefined).passed).toBe(false);
  });
});

describe("evaluateCondition: date operators", () => {
  it("before and after compare points in time, not strings", () => {
    expect(check("customer.signupDate", "before", "2026-01-01").passed).toBe(true);
    expect(check("customer.signupDate", "after", "2026-01-01").passed).toBe(false);
    expect(check("customer.signupDate", "after", "2024-01-01").passed).toBe(true);
  });

  it("between works on dates too", () => {
    expect(
      check("customer.signupDate", "between", ["2025-01-01", "2025-12-31"]).passed,
    ).toBe(true);
  });
});

describe("evaluateCondition: missing fields", () => {
  it("fails rather than throwing", () => {
    expect(check("cart.discount", "gt", 10).passed).toBe(false);
  });

  it("reports the missing value as actual", () => {
    expect(check("cart.discount", "gt", 10).actual).toBeUndefined();
  });

  it("passes neq, because a missing value is indeed not the expected one", () => {
    expect(check("cart.discount", "neq", 10).passed).toBe(true);
  });

  it("fails boolean operators on a missing field", () => {
    expect(check("customer.isVip", "isTrue", undefined).passed).toBe(false);
    expect(check("customer.isVip", "isFalse", undefined).passed).toBe(false);
  });
});

describe("evaluateCondition: the explanation", () => {
  it("states only the observed value when the condition passes", () => {
    expect(check("cart.total", "gt", 50).explain).toBe("cart.total was 80");
  });

  it("states what was expected when it fails", () => {
    expect(check("cart.total", "gt", 100).explain).toBe(
      "cart.total was 80, expected > 100",
    );
  });

  it("quotes strings", () => {
    expect(check("customer.tier", "eq", "gold").explain).toBe(
      'customer.tier was "silver", expected "gold"',
    );
  });

  it("spells out a range", () => {
    expect(check("cart.total", "between", [100, 200]).explain).toBe(
      "cart.total was 80, expected between 100 and 200",
    );
  });

  it("says missing when the field is not there", () => {
    expect(check("cart.discount", "gt", 10).explain).toBe(
      "cart.discount was missing, expected > 10",
    );
  });

  it("carries actual and expected as data, not only in the sentence", () => {
    const result = check("customer.tier", "eq", "gold");
    expect(result.actual).toBe("silver");
    expect(result.expected).toBe("gold");
  });

  it("keeps the node id so the UI can find the row", () => {
    expect(check("cart.total", "gt", 100).id).toBe("c1");
  });
});

/** Helpers for the group cases. */
function condition(
  id: string,
  field: string,
  operator: Operator,
  value: unknown,
): ConditionNode {
  return { id, kind: "condition", field, operator, value };
}

function group(id: string, op: "AND" | "OR", children: GroupNode["children"]): GroupNode {
  return { id, kind: "group", op, children };
}

describe("evaluateGroup: AND", () => {
  it("passes when every child passes", () => {
    const rule = group("g", "AND", [
      condition("a", "cart.total", "gt", 50),
      condition("b", "customer.tier", "eq", "silver"),
    ]);
    const result = evaluate(rule, cart) as GroupResult;
    expect(result.passed).toBe(true);
    expect(result.blamed).toEqual([]);
  });

  it("fails and blames only the children that failed", () => {
    const rule = group("g", "AND", [
      condition("a", "cart.total", "gt", 50),
      condition("b", "customer.tier", "eq", "gold"),
    ]);
    const result = evaluate(rule, cart) as GroupResult;
    expect(result.passed).toBe(false);
    expect(result.blamed).toEqual(["b"]);
  });

  it("blames all failing children, not just the first", () => {
    const rule = group("g", "AND", [
      condition("a", "cart.total", "gt", 500),
      condition("b", "customer.tier", "eq", "gold"),
    ]);
    expect((evaluate(rule, cart) as GroupResult).blamed).toEqual(["a", "b"]);
  });
});

describe("evaluateGroup: OR", () => {
  it("passes when at least one child passes", () => {
    const rule = group("g", "OR", [
      condition("a", "cart.total", "gt", 500),
      condition("b", "customer.tier", "eq", "silver"),
    ]);
    const result = evaluate(rule, cart) as GroupResult;
    expect(result.passed).toBe(true);
    expect(result.blamed).toEqual([]);
  });

  it("blames every child when none passed", () => {
    const rule = group("g", "OR", [
      condition("a", "cart.total", "gt", 500),
      condition("b", "customer.tier", "eq", "gold"),
    ]);
    const result = evaluate(rule, cart) as GroupResult;
    expect(result.passed).toBe(false);
    expect(result.blamed).toEqual(["a", "b"]);
  });
});

describe("evaluateGroup: structure", () => {
  it("an empty group passes and blames nobody", () => {
    const result = evaluate(group("g", "AND", []), cart) as GroupResult;
    expect(result.passed).toBe(true);
    expect(result.blamed).toEqual([]);
  });

  it("mirrors the rule tree node for node, in order", () => {
    const rule = group("g", "AND", [
      condition("a", "cart.total", "gt", 50),
      group("inner", "OR", [condition("b", "customer.tier", "eq", "gold")]),
    ]);
    const result = evaluate(rule, cart) as GroupResult;
    expect(result.children.map((child) => child.id)).toEqual(["a", "inner"]);
    expect(result.children[1].kind).toBe("group");
  });

  it("propagates a nested failure upward", () => {
    const rule = group("g", "AND", [
      condition("a", "cart.total", "gt", 50),
      group("inner", "OR", [
        condition("b", "customer.tier", "eq", "gold"),
        condition("c", "customer.country", "eq", "FR"),
      ]),
    ]);
    const result = evaluate(rule, cart) as GroupResult;

    expect(result.passed).toBe(false);
    // The outer AND blames the group, not the leaves.
    expect(result.blamed).toEqual(["inner"]);

    const inner = result.children[1] as GroupResult;
    // The inner OR is where the leaves get blamed.
    expect(inner.blamed).toEqual(["b", "c"]);
  });

  it("evaluates a bare condition passed straight to evaluate", () => {
    const result = evaluate(condition("solo", "cart.total", "gt", 50), cart);
    expect(result).toMatchObject({ kind: "condition", passed: true });
  });
});
