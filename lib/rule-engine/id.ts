/**
 * Node id generation.
 *
 * Kept out of `tree.ts` on purpose: every function in `tree.ts` is pure and
 * deterministic, which is what makes it straightforward to test. Ids are minted
 * at the edge, by the hook that creates new nodes, never deep inside a
 * transformation.
 */

let counter = 0;

/** A short id, unique within one browser session. */
export function createId(prefix = "n"): string {
  counter += 1;
  return `${prefix}${counter}`;
}

/** Test helper: makes id sequences reproducible across cases. */
export function resetIdCounter(): void {
  counter = 0;
}
