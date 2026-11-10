import { Box, Button, Typography } from "@mui/material";
import { Cell, Pie, PieChart } from "recharts";
import { colors } from "../config/colors";
import { chartShadow } from "../config/colors";
import type { InflowChannel } from "../types/overview";

// first colour is for "Static VA", second for "Dynamic"
const SLICE_COLORS = [colors.pieLight, colors.pieDarkBlue];

export default function InflowChannelChart({
  data,
}: {
  data: InflowChannel[];
}) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        boxShadow: chartShadow,
        fontFamily: '"Google Sans", sans-serif',
      }}
    >
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 15,
            color: colors.inflowText,
            fontFamily: '"Google Sans", sans-serif',
          }}
        >
          Inflow Channel
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 2,
            mt: 1,
          }}
        >
          <PieChart width={270} height={270}>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={SLICE_COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          {/* legend */}
          <Box sx={{ mt: 1 }}>
            {data.map((item, index) => (
              <Box
                key={item.name}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: SLICE_COLORS[index],
                  }}
                />
                <Typography sx={{ fontSize: 13, color: colors.textDark }}>
                  {item.name} - {item.value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${colors.border}`,
          p: 2,
          textAlign: "right",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 700,
            color: colors.inflowText,
            fontFamily: '"Google Sans", sans-serif',
            borderColor: "#D0D5DD",
          }}
        >
          View full report
        </Button>
      </Box>
    </Box>
  );
}
