import { Typography } from "@mui/material";
import { colors } from "../config/colors";

export default function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{ fontSize: 12, fontWeight: 700, color: colors.textDark, mb: 1 }}
    >
      {children}
    </Typography>
  );
}
