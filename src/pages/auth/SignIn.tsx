import { Box, Typography } from "@mui/material";
import SignInForm from "./SignInForm";
import SignInBg from "../../assets/images/signin-bg.png";

export default function SignIn() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      }}
    >
      {/* LEFT: logo, headings, form */}
      <Box sx={{ bgcolor: "#fff", px: { xs: 3, md: 20 }, py: 6 }}>
        <Box sx={{ maxWidth: 460 }}>
          <Box
            component="img"
            src="/fsdh-mb.png"
            alt="FSDH Merchant Bank"
            sx={{
              width: 150,
              height: "auto",
              display: "block",
              mb: { xs: 6, md: 12 },
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: "32px",
              lineHeight: "44px",
              letterSpacing: "-0.02em",
              color: "primary.main",
              mb: 4,
            }}
          >
            FSDH Payhub
          </Typography>

          <Typography
            sx={{ color: "#0B1C3D", fontSize: 30, fontWeight: 600, mb: 3 }}
          >
            Sign In
          </Typography>

          <SignInForm />
        </Box>
      </Box>

      {/* RIGHT: blue carousel panel with background lines (hidden on small screens) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          bgcolor: "primary.main",
          backgroundImage: `url(${SignInBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 6,
        }}
      >
        {/* CAROUSEL GOES HERE */}
        <Box
          sx={{
            width: 360,
            height: 360,
            borderRadius: "16px",
            bgcolor: "rgba(255,255,255,0.25)",
            display: "grid",
            placeItems: "center",
          }}
        >
          Slide image
        </Box>
        <Typography sx={{ fontSize: 26, fontWeight: 600, mt: 6 }}>
          Centralized Report Management
        </Typography>
        <Typography
          sx={{ maxWidth: 420, textAlign: "center", mt: 1, opacity: 0.9 }}
        >
          Easily collect, manage, and consolidate NDIC reports from a single,
          secure platform.
        </Typography>
      </Box>
    </Box>
  );
}
