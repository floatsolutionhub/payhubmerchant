import PageHeader from "../components/PageHeader";
import CollectionsRow from "../components/CollectionsRow";
import VolumeTrendsChart from "../components/VolumeTrendsChart";
import InflowChannelChart from "../components/InflowChannelChart";
import TransactionsTable from "../components/TransactionsTable";
import { Transaction } from "../types/overview";
import { Box } from "@mui/material";
import {
  collectionStats,
  volumeTrends,
  inflowChannels,
  collectionTransactions,
  TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_TOTAL,
} from "../data/overviewMock";
import { useState, useEffect } from "react";

export default function Collections() {
  const [collectionRows, setCollectionRows] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCollectionRows(collectionTransactions);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageHeader
        title="Collections"
        subtitle="FSDH 360 virtual Account inflows."
      />

      <Box sx={{ m: 2.5 }}>
        <CollectionsRow stats={collectionStats} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            lg: "minmax(0, 2fr) minmax(340px, 1fr)",
          },
          gap: 3,
          my: 4,
          mx: 2.5,
        }}
      >
        <VolumeTrendsChart data={volumeTrends} />
        <InflowChannelChart data={inflowChannels} />
      </Box>

      <Box sx={{ m: 2.5 }}>
        <TransactionsTable
          collectionRows={collectionRows}
          collectionTotal={TRANSACTIONS_TOTAL}
          pageSize={TRANSACTIONS_PAGE_SIZE}
          searchPlaceholder="Search by date, amount, Account No, ref..."
          isLoading={isLoading}
        />
      </Box>
    </>
  );
}
