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

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          overflow: "hidden",
          bgcolor: "primary.main",
          color: "#fff",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 6,

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${SignInBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.03,
            pointerEvents: "none",
          },

          "& > *": { position: "relative", zIndex: 1 },
        }}
      >
        <AuthCarousel />
      </Box>
    </Box>
  );
}
