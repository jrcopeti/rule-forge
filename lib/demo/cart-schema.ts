/**
 * The demo schema: an e-commerce cart.
 *
 * This is the shape a host application would pass into the builder. Nothing in
 * `lib/rule-engine` knows about carts, tiers or coupons; swapping this file for
 * a feature-flag schema or a fraud-rule schema is the only change needed to
 * point the builder at a different domain.
 */

import type { Schema } from "@/lib/rule-engine/types";

export const cartSchema: Schema = [
  { key: "cart.total", label: "Cart total", type: "number", unit: "€" },
  { key: "cart.itemCount", label: "Item count", type: "number" },
  {
    key: "customer.tier",
    label: "Customer tier",
    type: "enum",
    options: ["bronze", "silver", "gold", "platinum"],
  },
  {
    key: "customer.country",
    label: "Country",
    type: "enum",
    options: ["DE", "AT", "CH", "FR"],
  },
  {
    key: "customer.isFirstPurchase",
    label: "First purchase",
    type: "boolean",
  },
  { key: "customer.signupDate", label: "Signup date", type: "date" },
  { key: "product.category", label: "Product category", type: "string" },
  { key: "coupon.code", label: "Coupon code", type: "string" },
];
