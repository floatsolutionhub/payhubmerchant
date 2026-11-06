import { useEffect } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { Monitor } from "lucide-react";
import { colors, shadow03 } from "../config/colors";

const PHONE_QUERY = "(max-width: 999px)";

export default function SmallScreenNotice() {
  const isPhone = useMediaQuery(PHONE_QUERY, { noSsr: true });

  useEffect(() => {
    if (!isPhone) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [isPhone]);

  if (!isPhone) return null;

  return (
    <Box
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="small-screen-title"
      sx={{
        position: "fixed",
        inset: 0, // covers the whole screen
        zIndex: 1200, // above the sidebar and header, below MUI dialogs
        display: "grid",
        placeItems: "center",
        p: 3,
        bgcolor: "rgba(243, 249, 255, 0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)", // for Safari on iPhones
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "16px",
          p: 4,
          maxWidth: 360,
          textAlign: "center",
          boxShadow: shadow03,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#E6F0F8",
            color: colors.primary,
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Monitor size={28} />
        </Box>

        <Typography
          id="small-screen-title"
          component="h2"
          sx={{ fontWeight: 700, fontSize: 20, color: colors.textDark, mb: 1 }}
        >
          Please use a wider screen
        </Typography>

        <Typography sx={{ fontSize: 15, color: colors.textSubtle }}>
          FSDH Payhub needs a wider screen to sign in, view and interact with
          the dashboard. Please open it on a tablet, laptop or desktop.
        </Typography>
      </Box>
    </Box>
  );
}
