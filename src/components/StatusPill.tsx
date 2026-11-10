import { Box } from "@mui/material";
import { colors } from "../config/colors";
import type { TransactionStatus } from "../types/overview";

const styles: Record<
  TransactionStatus,
  { color: string; bg: string; border: string }
> = {
  Successful: {
    color: colors.success,
    bg: colors.successBg,
    border: colors.successBgBorder,
  },
  Pending: {
    color: colors.pending,
    bg: colors.pendingBg,
    border: colors.pendingBgBorder,
  },
  Failed: {
    color: colors.failed,
    bg: colors.failedBg,
    border: colors.failedBgBorder,
  },
};

export default function StatusPill({ status }: { status: TransactionStatus }) {
  const s = styles[status];

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1,
        py: 0.5,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        color: s.color,
        bgcolor: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {/* the small dot before the text */}
      <Box
        sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.color }}
      />
      {status}
    </Box>
  );
}
