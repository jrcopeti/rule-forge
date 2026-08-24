import { describe, expect, it } from "vitest";

import { buildExplain, formatExpectation, formatValue } from "./explain";

describe("formatValue", () => {
  it("quotes strings so an empty value is visible", () => {
    expect(formatValue("gold")).toBe('"gold"');
    expect(formatValue("")).toBe('""');
  });

  it("leaves numbers and booleans bare", () => {
    expect(formatValue(80)).toBe("80");
    expect(formatValue(false)).toBe("false");
  });

  it("names the absent cases", () => {
    expect(formatValue(undefined)).toBe("missing");
    expect(formatValue(null)).toBe("null");
  });

  it("renders arrays with their entries formatted too", () => {
    expect(formatValue(["gold", "platinum"])).toBe('["gold", "platinum"]');
  });
});

describe("formatExpectation", () => {
  it("says nothing extra for a plain equality", () => {
    expect(formatExpectation("eq", "gold")).toBe('"gold"');
  });

  it("reads as English for the awkward operators", () => {
    expect(formatExpectation("neq", "gold")).toBe('anything but "gold"');
    expect(formatExpectation("contains", "sneak")).toBe('to contain "sneak"');
    expect(formatExpectation("in", ["a", "b"])).toBe('one of ["a", "b"]');
    expect(formatExpectation("between", [10, 20])).toBe("between 10 and 20");
  });

  it("keeps comparisons as symbols", () => {
    expect(formatExpectation("gte", 100)).toBe(">= 100");
  });
});

describe("buildExplain", () => {
  it("omits the expectation when the condition passed", () => {
    expect(buildExplain("cart.total", "gt", 80, 50, true)).toBe("cart.total was 80");
  });

  it("states the expectation when it failed", () => {
    expect(buildExplain("cart.total", "gt", 80, 100, false)).toBe(
      "cart.total was 80, expected > 100",
    );
  });
});
