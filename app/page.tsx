import { RuleBuilder } from "@/components/rule-builder/RuleBuilder";
import { cartSchema } from "@/lib/demo/cart-schema";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">rule-forge</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Build a condition tree, watch the JSON update as you go, and evaluate
          it against a sample record to see exactly which condition failed.
        </p>
      </header>
      <RuleBuilder schema={cartSchema} />
    </main>
  );
}
