import { Box } from "@mui/material";
import MoneyOut from "../assets/icons/money-arrow-up.svg?react";
import CheckCircle from "../assets/icons/check-circle.svg?react";
import TimeHalf from "../assets/icons/time-half.svg?react";
import RemoveCircle from "../assets/icons/remove-circle.svg?react";
import StatCard from "./StatCard";
import SectionLabel from "./SectionLabel";
import { colors } from "../config/colors";
import type { PayoutStats } from "../types/overview";
import { nairaShort, monthToDate } from "../utils/format";

export default function PayoutsRow({ stats }: { stats: PayoutStats }) {
  return (
    <Box>
      <SectionLabel>PAYOUTS - FSDH PAY</SectionLabel>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 2,
        }}
      >
        <StatCard
          variant="green"
          label="Total Payout Value"
          value={nairaShort(stats.totalValue)}
          icon={MoneyOut}
          iconBg="#003C700D"
          badge={`${stats.totalValueChange} %`}
          badgeBg="#FFFFFF"
          badgeColor="#067647"
          showTrend
        />

        <StatCard
          label="Successful payouts"
          value={nairaShort(stats.successful)}
          icon={CheckCircle}
          iconColor={colors.success}
          iconBg={colors.successBg}
          caption={monthToDate()}
        />

        <StatCard
          label="Pending payouts"
          value={String(stats.pending)}
          icon={TimeHalf}
          iconColor={colors.pending}
          iconBg={colors.pendingBg}
          caption="Queued or in transit"
        />

        <StatCard
          label="Failed payouts"
          value={String(stats.failed)}
          valueColor={colors.failed}
          icon={RemoveCircle}
          iconColor={colors.failed}
          iconBg={colors.failedBg}
          caption="Check error codes"
        />
      </Box>
    </Box>
  );
}
