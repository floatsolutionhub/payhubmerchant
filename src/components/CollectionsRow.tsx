import { Box } from "@mui/material";
import MoneyInIcon from "../assets/icons/money-arrow-down.svg?react";
import WalletIn from "../assets/icons/wallet-arrow-down.svg?react";
import CheckCircle from "../assets/icons/check-circle.svg?react";
import TimeHalf from "../assets/icons/time-half.svg?react";
import RemoveCircle from "../assets/icons/remove-circle.svg?react";
import StatCard from "./StatCard";
import SectionLabel from "./SectionLabel";
import { colors } from "../config/colors";
import type { CollectionStats } from "../types/overview";
import { nairaShort, count, monthToDate } from "../utils/format";

export default function CollectionsRow({ stats }: { stats: CollectionStats }) {
  return (
    <Box>
      <SectionLabel>COLLECTIONS - FSDH 360</SectionLabel>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 2,
        }}
      >
        <StatCard
          variant="navy"
          label="Total collections today"
          value={nairaShort(stats.totalToday)}
          icon={MoneyInIcon}
          iconColor="#FFFFFF"
          iconBg="#FFFFFF0D"
          badge={`${stats.totalTodayChange} %`}
          badgeBg="#E2FFF31A"
          badgeColor="#8BFFCE"
          showTrend
        />

        <StatCard
          label="Collections this month"
          value={nairaShort(stats.thisMonth)}
          icon={WalletIn}
          iconColor="#0B1739"
          iconBg="#003C700D"
          caption={monthToDate()}
        />

        <StatCard
          label="Successful collections"
          value={`${count(stats.successful)}+`}
          icon={CheckCircle}
          iconColor={colors.success}
          iconBg={colors.successBg}
          badge={`${stats.successRate} %`}
          badgeBg="#0676470D"
          badgeColor="#067647"
          caption="Success Rate"
        />

        <StatCard
          label="Pending collections"
          value={String(stats.pending)}
          icon={TimeHalf}
          iconColor={colors.pending}
          iconBg={colors.pendingBg}
          caption="Awaiting Action"
        />

        <StatCard
          label="Failed collections"
          value={String(stats.failed)}
          icon={RemoveCircle}
          iconColor={colors.failed}
          iconBg={colors.failedBg}
          caption="Requires Action"
        />
      </Box>
    </Box>
  );
}
