import { Box, Typography } from "@mui/material";
import SignInForm from "./SignInForm";
import SignInBg from "../../assets/images/signin-bg.png";
import AuthCarousel from "../../components/AuthCarousel";

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
            sx={{
              fontFamily: '"Google Sans", sans-serif',
              color: "#0B1C3D",
              fontSize: 30,
              fontWeight: 700,
              mb: 3,
            }}
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
          position: "relative", // lets the image layer sit inside this panel
          overflow: "hidden",
          bgcolor: "primary.main", // the blue, full strength
          color: "#fff",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 6,

          // the image layer, faded to 3%
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0, // stretch to all four edges
            backgroundImage: `url(${SignInBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.03,
            pointerEvents: "none",
          },

          // keep the slide, title and text above the image layer
          "& > *": { position: "relative", zIndex: 1 },
        }}
      >
        {/* CAROUSEL GOES HERE */}
        <AuthCarousel />
      </Box>
    </Box>
  );
}
