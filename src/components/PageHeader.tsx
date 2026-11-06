import type { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { colors } from "../config/colors";

interface PageHeaderProps {
  title: string;
  subtitle: ReactNode; // ReactNode lets us put a bold date inside the text
  actionLabel?: string;
  onAction?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  actionLabel = "Generate Report",
  onAction,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ m: 2.5 }}>
        <Typography
          component="h2"
          sx={{ fontWeight: 600, fontSize: 18, color: colors.textDark }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 16, color: colors.textSubtle, mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onAction}
        sx={{
          bgcolor: colors.navy,
          textTransform: "none",
          borderRadius: "4px",
          px: 2.5,
          py: 1.25,
          mr: 3,
          boxShadow: "none",
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: colors.primary, boxShadow: "none" },
        }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}
