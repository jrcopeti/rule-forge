import { describe, expect, it } from "vitest";

import {
  countNodes,
  findNode,
  insertNode,
  removeNode,
  updateNode,
} from "./tree";
import type { ConditionNode, GroupNode } from "./types";

/**
 * Fixture:
 *
 *   root (AND)
 *   ├── total          cart.total > 50
 *   └── inner (OR)
 *       ├── tier       customer.tier eq "gold"
 *       └── country    customer.country eq "DE"
 *
 * Built fresh per test so nothing leaks between cases.
 */
function makeTree(): GroupNode {
  return {
    id: "root",
    kind: "group",
    op: "AND",
    children: [
      {
        id: "total",
        kind: "condition",
        field: "cart.total",
        operator: "gt",
        value: 50,
      },
      {
        id: "inner",
        kind: "group",
        op: "OR",
        children: [
          {
            id: "tier",
            kind: "condition",
            field: "customer.tier",
            operator: "eq",
            value: "gold",
          },
          {
            id: "country",
            kind: "condition",
            field: "customer.country",
            operator: "eq",
            value: "DE",
          },
        ],
      },
    ],
  };
}

const newCondition: ConditionNode = {
  id: "fresh",
  kind: "condition",
  field: "coupon.code",
  operator: "eq",
  value: "SUMMER25",
};

describe("findNode", () => {
  it("finds the root itself", () => {
    const tree = makeTree();
    expect(findNode(tree, "root")).toBe(tree);
  });

  it("finds a direct child", () => {
    expect(findNode(makeTree(), "total")?.id).toBe("total");
  });

  it("finds a node nested inside a group", () => {
    const found = findNode(makeTree(), "country");
    expect(found).toMatchObject({ kind: "condition", field: "customer.country" });
  });

  it("returns undefined for an id that is not in the tree", () => {
    expect(findNode(makeTree(), "nope")).toBeUndefined();
  });
});

describe("insertNode", () => {
  it("appends to the root group", () => {
    const next = insertNode(makeTree(), "root", newCondition);
    expect(next.children).toHaveLength(3);
    expect(next.children[2]).toBe(newCondition);
  });

  it("appends to a nested group", () => {
    const next = insertNode(makeTree(), "inner", newCondition);
    const inner = findNode(next, "inner") as GroupNode;
    expect(inner.children.map((child) => child.id)).toEqual([
      "tier",
      "country",
      "fresh",
    ]);
  });

  it("does not mutate the tree it was given", () => {
    const tree = makeTree();
    insertNode(tree, "root", newCondition);
    expect(tree.children).toHaveLength(2);
  });

  it("leaves untouched branches referentially identical", () => {
    const tree = makeTree();
    const next = insertNode(tree, "inner", newCondition);
    // "total" was nowhere near the change, so it must be the very same object.
    expect(next.children[0]).toBe(tree.children[0]);
    expect(next).not.toBe(tree);
  });

  it("ignores an unknown parent id", () => {
    const tree = makeTree();
    expect(insertNode(tree, "nope", newCondition)).toEqual(tree);
  });

  it("refuses to insert into a condition, which has no children", () => {
    const tree = makeTree();
    expect(insertNode(tree, "total", newCondition)).toEqual(tree);
  });
});

describe("updateNode", () => {
  it("patches a condition", () => {
    const next = updateNode(makeTree(), "total", { operator: "gte", value: 100 });
    expect(findNode(next, "total")).toMatchObject({
      field: "cart.total",
      operator: "gte",
      value: 100,
    });
  });

  it("patches a group operator", () => {
    const next = updateNode(makeTree(), "inner", { op: "AND" });
    expect((findNode(next, "inner") as GroupNode).op).toBe("AND");
  });

  it("keeps id and kind no matter what the patch says", () => {
    const next = updateNode(makeTree(), "tier", { value: "platinum" });
    expect(findNode(next, "tier")).toMatchObject({
      id: "tier",
      kind: "condition",
    });
  });

  it("does not mutate the tree it was given", () => {
    const tree = makeTree();
    updateNode(tree, "total", { value: 999 });
    expect((tree.children[0] as ConditionNode).value).toBe(50);
  });

  it("ignores an unknown id", () => {
    const tree = makeTree();
    expect(updateNode(tree, "nope", { value: 1 })).toEqual(tree);
  });
});

describe("removeNode", () => {
  it("removes a direct child", () => {
    const next = removeNode(makeTree(), "total");
    expect(next.children.map((child) => child.id)).toEqual(["inner"]);
  });

  it("removes a nested child", () => {
    const next = removeNode(makeTree(), "tier");
    const inner = findNode(next, "inner") as GroupNode;
    expect(inner.children.map((child) => child.id)).toEqual(["country"]);
  });

  it("removes a group together with everything inside it", () => {
    const next = removeNode(makeTree(), "inner");
    expect(next.children.map((child) => child.id)).toEqual(["total"]);
    expect(findNode(next, "tier")).toBeUndefined();
  });

  it("never removes the root", () => {
    const tree = makeTree();
    expect(removeNode(tree, "root")).toEqual(tree);
  });

  it("does not mutate the tree it was given", () => {
    const tree = makeTree();
    removeNode(tree, "tier");
    expect(countNodes(tree)).toBe(5);
  });
});

describe("countNodes", () => {
  it("counts every node including the root", () => {
    expect(countNodes(makeTree())).toBe(5);
  });

  it("counts a lone condition as one", () => {
    expect(countNodes(newCondition)).toBe(1);
  });

  it("counts an empty group as one", () => {
    expect(countNodes({ id: "a", kind: "group", op: "AND", children: [] })).toBe(1);
  });
});
