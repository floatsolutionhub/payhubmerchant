import { Box } from "@mui/material";
import PageHeader from "../components/PageHeader";
import CollectionsRow from "../components/CollectionsRow";
import PayoutsRow from "../components/PayoutsRow";
import {
  collectionStats,
  payoutStats,
  volumeTrends,
  inflowChannels,
  collectionTransactions,
  TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_TOTAL,
  payoutTransactions,
} from "../data/overviewMock";
import { longDate } from "../utils/format";
import VolumeTrendsChart from "../components/VolumeTrendsChart";
import InflowChannelChart from "../components/InflowChannelChart";
import TransactionsTable from "../components/TransactionsTable";
import { useEffect, useState } from "react";
import type { Transaction } from "../types/overview";

export default function Overview() {
  const [isLoading, setIsLoading] = useState(true);
  const [collectionRows, setCollectionRows] = useState<Transaction[]>([]);
  const [payoutRows, setPayoutRows] = useState<Transaction[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCollectionRows(collectionTransactions);
      setPayoutRows(payoutTransactions);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader
        title="OVERVIEW"
        subtitle={
          <>
            Consolidated position across FSDH 360 collections and FSDH Pay-outs
            - <b className="text-[#565656]">{longDate()}</b>
          </>
        }
      />

      <Box sx={{ m: 2.5 }}>
        <CollectionsRow stats={collectionStats} />
      </Box>

      <Box sx={{ m: 2.5 }}>
        <PayoutsRow stats={payoutStats} />
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

      <Box sx={{ m: 2.5 }}>
        <TransactionsTable
          collectionRows={collectionRows}
          collectionTotal={TRANSACTIONS_TOTAL}
          payoutRows={payoutRows}
          pageSize={TRANSACTIONS_PAGE_SIZE}
          searchPlaceholder="Search by date, amount, Account No, ref..."
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}
