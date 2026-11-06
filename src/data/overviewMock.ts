import type {
  CollectionStats,
  InflowChannel,
  PayoutStats,
  Transaction,
  TransactionStatus,
  VolumePoint,
} from "../types/overview";

// Stat cards
export const collectionStats: CollectionStats = {
  totalToday: 78_700_000_000,
  totalTodayChange: 9.8,
  thisMonth: 78_700_000_000,
  successful: 12800,
  successRate: 98.8,
  pending: 147,
  failed: 64,
};

export const payoutStats: PayoutStats = {
  totalValue: 78_700_000_000,
  totalValueChange: 9.8,
  successful: 78_700_000_000,
  pending: 56,
  failed: 23,
};

// Volume Trends chart
export const volumeTrends: VolumePoint[] = [
  { month: "Jan", fsdh360: 60, fsdhPay: 38 },
  { month: "Feb", fsdh360: 62, fsdhPay: 40 },
  { month: "Mar", fsdh360: 61, fsdhPay: 39 },
  { month: "Apr", fsdh360: 62, fsdhPay: 40 },
  { month: "May", fsdh360: 64, fsdhPay: 42 },
  { month: "Jun", fsdh360: 68, fsdhPay: 44 },
  { month: "Jul", fsdh360: 63, fsdhPay: 41 },
  { month: "Aug", fsdh360: 70, fsdhPay: 45 },
  { month: "Sep", fsdh360: 72, fsdhPay: 46 },
  { month: "Oct", fsdh360: 69, fsdhPay: 44 },
  { month: "Nov", fsdh360: 73, fsdhPay: 47 },
  { month: "Dec", fsdh360: 82, fsdhPay: 52 },
];

// Inflow Channel doughnut
export const inflowChannels: InflowChannel[] = [
  { name: "Static VA", value: 65 },
  { name: "Dynamic", value: 35 },
];

// Transactions table
export const TRANSACTIONS_TOTAL = 240; // the number in the grey badge in Figma
export const TRANSACTIONS_PAGE_SIZE = 7; // Figma shows 7 rows per page

const otherCustomers = [
  "Tunde Bakare",
  "Chiamaka Obi",
  "Ibrahim Lawal",
  "Ngozi Eze",
  "Halima Kadiri",
];
const otherAmounts = [15_500_000, 2_450_000_000, 780_000_000, 96_200_000_000];

// Builds fake rows. Page 1 (the first 7 rows) matches Figma exactly.
// Later pages are varied so we can test search, paging and the three status colours.
function makeTransactions(idPrefix: string, count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const isPageOne = i < TRANSACTIONS_PAGE_SIZE;

    let status: TransactionStatus = "Successful";
    if (!isPageOne) {
      if (i % 5 === 0) status = "Failed";
      else if (i % 3 === 0) status = "Pending";
    }

    const day = String(8 - (i % 7)).padStart(2, "0"); // 08, 07, ... 02

    return {
      id: `${idPrefix}${743 + i}`, // unique, so React keys work
      virtualAcct: "1000447873",
      collectionAcct: "1000345673",
      collectionAcctName: "Revlant Int LTD",
      customer: isPageOne
        ? "Halima Kadiri"
        : otherCustomers[i % otherCustomers.length],
      amount: isPageOne
        ? 234_000_000_000
        : otherAmounts[i % otherAmounts.length],
      date: isPageOne ? "2026-08-08T14:22:23" : `2026-08-${day}T14:22:23`,
      status,
      notification: status,
    };
  });
}

// 70 rows = 10 pages of 7, so "Page 1 of 10" works like Figma
export const collectionTransactions = makeTransactions("238423Acvs", 70);

// PLACEHOLDER: the FSDH PAY tab is not in the Figma yet.
// Same shape as above until the designer shares that tab.
export const payoutTransactions = makeTransactions("PAY9921Xk", 70);
