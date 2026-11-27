"use client";

/**
 * The panel that answers "why did this rule not match".
 *
 * This is the reason the project is worth building. Every other rule builder
 * tells you yes or no; this one walks the trace and points at the row.
 *
 * TODO: implement.
 *  1. A select of `sampleCarts` at the top, plus the overall verdict badge:
 *     MATCH or NO MATCH.
 *  2. Walk the rule and the `EvalResult` together, in step, rendering one line
 *     per node with the same indentation the builder uses.
 *  3. Green check for a passing node, red cross for a failing one, and the
 *     node's `explain` sentence beside it.
 *  4. When a node's id appears in its parent's `blamed`, mark that row with
 *     `<- failed here`. That is the whole feature.
 *  5. Do not evaluate an invalid rule. If `isRuleValid` is false, say which
 *     conditions are still incomplete instead.
 */

import type { EvalResult, RuleNode } from "@/lib/rule-engine/types";

export type EvalPanelProps = {
  rule: RuleNode;
  result: EvalResult | null;
};

export function EvalPanel(_props: EvalPanelProps) {
  return <div>TODO: EvalPanel</div>;
}
