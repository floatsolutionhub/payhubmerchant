import type { ComponentType } from "react";
import { Box, Typography } from "@mui/material";
import { TrendingUp } from "lucide-react";
import { colors } from "../config/colors";

type IconComponent = ComponentType<{
  width?: number | string;
  height?: number | string;
}>;

type Variant = "navy" | "green" | "plain";

interface StatCardProps {
  label: string;
  value: string;
  icon: IconComponent;
  variant?: Variant;
  width?: number | string;
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  showTrend?: boolean;
  caption?: string;
}

const backgrounds: Record<Variant, string> = {
  navy: colors.collectionNavy,
  green: colors.payoutGreen,
  plain: "#fff",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "plain",
  width = "100%",
  iconColor,
  iconBg,
  valueColor,
  badge,
  badgeBg,
  badgeColor,
  showTrend = false,
  caption,
}: StatCardProps) {
  const isDark = variant !== "plain";

  return (
    <Box
      sx={{
        bgcolor: backgrounds[variant],
        width,
        flexShrink: 0,
        boxSizing: "border-box",
        color: isDark ? "#fff" : colors.textDark,
        borderRadius: "8px",
        p: 1.5,
        minHeight: 124,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{ fontSize: 15, color: isDark ? "#fff" : colors.textSubtle }}
        >
          {label}
        </Typography>

        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "5px",
            display: "grid",
            placeItems: "center",
            bgcolor: iconBg ?? "transparent",
            color: iconColor ?? (isDark ? "#fff" : colors.textDark),
            '& svg [fill]:not([fill="none"])': { fill: "currentColor" },
            '& svg [stroke]:not([stroke="none"])': { stroke: "currentColor" },
          }}
        >
          <Icon width={22} height={22} />
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: 24,
          fontWeight: 700,
          color: valueColor ?? "inherit",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 20 }}
      >
        {badge && (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.25,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 500,
              bgcolor: badgeBg,
              color: badgeColor,
            }}
          >
            {badge}
            {showTrend && <TrendingUp size={12} />}
          </Box>
        )}
        {caption && (
          <Typography
            sx={{
              fontSize: 11,
              color: isDark ? "rgba(255, 255, 255, 0.8)" : colors.textGrey,
            }}
          >
            {caption}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
