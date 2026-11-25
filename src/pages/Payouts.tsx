import PageHeader from "../components/PageHeader";
import PayoutsRow from "../components/PayoutsRow";
import VolumeTrendsChart from "../components/VolumeTrendsChart";
import InflowChannelChart from "../components/InflowChannelChart";
import TransactionsTable from "../components/TransactionsTable";
import { Transaction } from "../types/overview";
import { Box } from "@mui/material";
import {
  payoutStats,
  volumeTrends,
  inflowChannels,
  payoutTransactions,
  TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_TOTAL,
} from "../data/overviewMock";
import { useState, useEffect } from "react";

export default function Payouts() {
  const [payoutRows, setPayoutRows] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPayoutRows(payoutTransactions);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader title="Payouts Transactions" subtitle="FSDH Pay outflows." />

      <Box sx={{ m: 2.5 }}>
        <PayoutsRow stats={payoutStats} />
      </Box>

      <Box sx={{ my: 4, mx: 2.5 }}>
        <TransactionsTable
          payoutRows={payoutRows}
          collectionTotal={TRANSACTIONS_TOTAL}
          pageSize={TRANSACTIONS_PAGE_SIZE}
          searchWidth={570}
          searchPlaceholder="Search by status, account number, reference number, customer name"
          isLoading={isLoading}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            lg: "minmax(0, 2fr) minmax(340px, 1fr)",
          },
          gap: 3,
          m: 2.5,
        }}
      >
        <VolumeTrendsChart data={volumeTrends} />
        <InflowChannelChart data={inflowChannels} />
      </Box>
    </>
  );
}
