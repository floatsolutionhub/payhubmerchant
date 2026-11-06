import { Box, IconButton, Typography } from "@mui/material";
import { MoreVertical } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colors } from "../config/colors";
import type { VolumePoint } from "../types/overview";
import { monthShort } from "../utils/format";
import LegendDot from "./LegendDot";

export default function VolumeTrendsChart({ data }: { data: VolumePoint[] }) {
  const monthTicks = data
    .filter(
      (point, i) =>
        i === 0 || point.date.slice(5, 7) !== data[i - 1].date.slice(5, 7),
    )
    .map((point) => point.date);

  const legendItems = [
    { name: "FSDH 360", color: colors.volume360 },
    { name: "FSDH Pay", color: colors.volumePay },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: `1px solid ${colors.border}`,
        fontFamily: '"Google Sans", sans-serif',
        borderRadius: "12px",
        p: 3,
      }}
    >
      {/* top: title and subtitle on the left, three-dots button on the right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 16,
              color: "#0F0F3D",
              fontFamily: '"Google Sans", sans-serif',
            }}
          >
            Volume Trends
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: colors.volumeTrendsT, mt: 0.5 }}
          >
            Daily Volume Trends in Millions
          </Typography>
        </Box>
        <IconButton
          size="small"
          aria-label="More options"
          sx={{ color: "#98A2B3" }}
        >
          <MoreVertical size={18} />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2.5,
          m: 4,
        }}
      >
        {legendItems.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LegendDot color={item.color} />
            <Typography
              sx={{ fontSize: 13, lineHeight: 1, color: colors.volumeTrendsT }}
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* the chart (it needs a fixed height, or it draws nothing) */}
      <Box sx={{ mt: 2 }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 16, left: 8 }}
          >
            {/* soft colour that fades out under each line */}
            <defs>
              <linearGradient id="fill360" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.volume360}
                  stopOpacity={0.12}
                />
                <stop
                  offset="100%"
                  stopColor={colors.volume360}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillPay" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.volumePay}
                  stopOpacity={0.1}
                />
                <stop
                  offset="100%"
                  stopColor={colors.volumePay}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#F2F4F7" />

            <XAxis
              dataKey="date"
              ticks={monthTicks}
              interval={0}
              tickFormatter={monthShort}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: colors.volumeTrendsT }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -12,
                fontSize: 12,
                fill: colors.volumeTrendsT,
              }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => (value === 0 ? "0" : `${value}m`)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: colors.volumeTrendsT }}
              label={{
                value: "Amount",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
                fill: colors.volumeTrendsT,
              }}
            />

            <Tooltip formatter={(value) => `${value}m`} />

            <Area
              type="monotone"
              dataKey="fsdh360"
              name="FSDH 360"
              stroke={colors.volume360}
              strokeWidth={2}
              fill="url(#fill360)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="fsdhPay"
              name="FSDH Pay"
              stroke={colors.volumePay}
              strokeWidth={2}
              fill="url(#fillPay)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
