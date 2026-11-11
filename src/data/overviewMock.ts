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
const monthlyAnchors = [
  { fsdh360: 60, fsdhPay: 38 }, // Jan - Dec
  { fsdh360: 62, fsdhPay: 40 },
  { fsdh360: 61, fsdhPay: 39 },
  { fsdh360: 62, fsdhPay: 40 },
  { fsdh360: 64, fsdhPay: 42 },
  { fsdh360: 68, fsdhPay: 44 },
  { fsdh360: 63, fsdhPay: 41 },
  { fsdh360: 70, fsdhPay: 45 },
  { fsdh360: 72, fsdhPay: 46 },
  { fsdh360: 69, fsdhPay: 44 },
  { fsdh360: 73, fsdhPay: 47 },
  { fsdh360: 82, fsdhPay: 52 },
];

const POINTS_PER_MONTH = 7;

const round1 = (n: number) => Math.round(n * 10) / 10;

function makeVolumeTrends(): VolumePoint[] {
  const points: VolumePoint[] = [];

  monthlyAnchors.forEach((current, monthIndex) => {
    const next = monthlyAnchors[monthIndex + 1] ?? current;

    for (let i = 0; i < POINTS_PER_MONTH; i++) {
      const progress = i / POINTS_PER_MONTH;

      const wiggle = Math.sin((monthIndex * POINTS_PER_MONTH + i) * 1.9);

      const month = String(monthIndex + 1).padStart(2, "0");
      const day = String(1 + i * 4).padStart(2, "0");

      points.push({
        date: `2026-${month}-${day}`,
        fsdh360: round1(
          current.fsdh360 +
            (next.fsdh360 - current.fsdh360) * progress +
            wiggle * 1.2,
        ),
        fsdhPay: round1(
          current.fsdhPay +
            (next.fsdhPay - current.fsdhPay) * progress +
            wiggle * 0.8,
        ),
      });
    }
  });

  return points;
}

export const volumeTrends = makeVolumeTrends();

// Inflow Channel doughnut
export const inflowChannels: InflowChannel[] = [
  { name: "Static VA", value: 65 },
  { name: "Dynamic", value: 35 },
];

// Transactions table
export const TRANSACTIONS_TOTAL = 240;
export const TRANSACTIONS_PAGE_SIZE = 7;

const otherCustomers = [
  "Tunde Bakare",
  "Chiamaka Obi",
  "Ibrahim Lawal",
  "Ngozi Eze",
  "Halima Kadiri",
];
const otherAmounts = [15_500_000, 2_450_000_000, 780_000_000, 96_200_000_000];


function makeTransactions(idPrefix: string, count: number): Transaction[] {
  return Array.from({ length: count }, (_, i) => {
    const isPageOne = i < TRANSACTIONS_PAGE_SIZE;

    let status: TransactionStatus = "Successful";
    if (!isPageOne) {
      if (i % 5 === 0) status = "Failed";
      else if (i % 3 === 0) status = "Pending";
    }

    const day = String(8 - (i % 7)).padStart(2, "0");

    return {
      id: `${idPrefix}${743 + i}`, 
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


export const collectionTransactions = makeTransactions("238423Acvs", 70);

// PLACEHOLDER: the FSDH PAY tab is not in the Figma yet.
// Same shape as above until the designer shares that tab.
export const payoutTransactions = makeTransactions("PAY9921Xk", 70);
