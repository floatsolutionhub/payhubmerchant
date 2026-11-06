import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import CollectionsRow from "../../components/CollectionsRow";
import PayoutsRow from "../../components/PayoutsRow";
import { collectionStats, payoutStats } from "../../data/overviewMock";
import { longDate } from "../../utils/format";

export default function Overview() {
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
    </>
  );
}
