/**
 * Records to evaluate rules against in the demo.
 *
 * These are not random. Each one is built to fail a common rule in a different
 * way, so the evaluation panel has something interesting to explain:
 *
 * - `gold-49`    fails a `total > 50` check by a single euro
 * - `silver-80`  passes on amount but fails on tier, isolating one node
 * - `bronze-45`  fails every branch of a typical OR
 * - `gold-120`   passes a two-condition AND outright
 * - `platinum-300` passes on everything, the control case
 *
 * Field keys in the schema are dotted paths, so the data is nested and the
 * evaluator has to walk it.
 */

import type { DataRecord } from "@/lib/rule-engine/types";

export type SampleRecord = {
  id: string;
  label: string;
  data: DataRecord;
};

export const sampleCarts: readonly SampleRecord[] = [
  {
    id: "silver-80",
    label: "Silver customer, 80€, sneakers",
    data: {
      cart: { total: 80, itemCount: 2 },
      customer: {
        tier: "silver",
        country: "DE",
        isFirstPurchase: false,
        signupDate: "2025-03-14",
      },
      product: { category: "sneakers" },
      coupon: { code: "" },
    },
  },
  {
    id: "gold-49",
    label: "Gold customer, 49€, sneakers",
    data: {
      cart: { total: 49, itemCount: 1 },
      customer: {
        tier: "gold",
        country: "FR",
        isFirstPurchase: false,
        signupDate: "2024-01-20",
      },
      product: { category: "sneakers" },
      coupon: { code: "" },
    },
  },
  {
    id: "bronze-45",
    label: "Bronze first-time buyer, 45€, socks",
    data: {
      cart: { total: 45, itemCount: 1 },
      customer: {
        tier: "bronze",
        country: "DE",
        isFirstPurchase: true,
        signupDate: "2026-08-01",
      },
      product: { category: "socks" },
      coupon: { code: "" },
    },
  },
  {
    id: "gold-120",
    label: "Gold customer, 120€, sneakers, SUMMER25",
    data: {
      cart: { total: 120, itemCount: 4 },
      customer: {
        tier: "gold",
        country: "AT",
        isFirstPurchase: false,
        signupDate: "2023-11-02",
      },
      product: { category: "sneakers" },
      coupon: { code: "SUMMER25" },
    },
  },
  {
    id: "platinum-300",
    label: "Platinum customer, 300€, jackets, VIP",
    data: {
      cart: { total: 300, itemCount: 7 },
      customer: {
        tier: "platinum",
        country: "CH",
        isFirstPurchase: false,
        signupDate: "2021-06-30",
      },
      product: { category: "jackets" },
      coupon: { code: "VIP" },
    },
  },
];
