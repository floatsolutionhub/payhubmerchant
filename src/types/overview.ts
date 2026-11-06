export type TransactionStatus = "Successful" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  virtualAcct: string;
  collectionAcct: string;
  collectionAcctName: string;
  customer: string;
  amount: number;
  date: string; // ISO text, e.g. '2026-08-08T14:22:23'
  status: TransactionStatus;
  notification: TransactionStatus;
}

export interface CollectionStats {
  totalToday: number;
  totalTodayChange: number;
  thisMonth: number;
  successful: number;
  successRate: number;
  pending: number;
  failed: number;
}

export interface PayoutStats {
  totalValue: number;
  totalValueChange: number;
  successful: number;
  pending: number;
  failed: number;
}

export interface VolumePoint {
  month: string;
  fsdh360: number;
  fsdhPay: number;
}

export interface InflowChannel {
  name: string;
  value: number;
}
