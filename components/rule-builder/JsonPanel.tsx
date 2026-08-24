"use client";

/**
 * The live JSON view.
 *
 * This panel is the actual product of the app: the rule the user just built,
 * in the form a host application would store and later execute. Showing it
 * while the rule is assembled is what makes the builder legible to engineers
 * rather than a black box.
 */

import { useState } from "react";

import { toJSON } from "@/lib/rule-engine/serialize";
import type { RuleNode } from "@/lib/rule-engine/types";

export type JsonPanelProps = {
  rule: RuleNode;
};

export function JsonPanel({ rule }: JsonPanelProps) {
  const [copied, setCopied] = useState(false);
  const json = toJSON(rule);

  async function copy() {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-neutral-200 dark:border-neutral-800">
      <header className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Live JSON
        </h2>
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </header>
      <pre className="overflow-auto p-3 text-xs leading-relaxed">
        <code>{json}</code>
      </pre>
    </section>
  );
}
