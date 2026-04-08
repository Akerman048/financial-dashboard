import { CURRENCIES } from "@/lib/currencies";

const currencyMap = Object.fromEntries(
  CURRENCIES.map((item) => [item.code, item])
);

export function formatCurrency(amount: number, currency = "USD") {
  const locale = currencyMap[currency]?.locale || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number, currency = "USD") {
  const symbol = currencyMap[currency]?.symbol || "$";

  if (Math.abs(amount) >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return `${symbol}${amount}`;
}