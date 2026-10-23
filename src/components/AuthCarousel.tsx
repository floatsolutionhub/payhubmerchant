import { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import slideImage from "../assets/images/bank-transfer-logo.png";

const slides = [
  {
    image: slideImage,
    title: "Your Payments, All in one place",
    text: "Manage your payment services from one central platform. Access the tools you need to keep your payment operations running smoothly.",
  },
  {
    image: slideImage,
    title: "Manage with Ease",
    text: "Manage API credentials, webhooks, and collection accounts from one convenient dashboard.",
  },
  {
    image: slideImage,
    title: "Stay in Control",
    text: "Keep track of your payment configurations and manage essential payment services with greater visibility and control.",
  },
];

// the slide-in / slide-out movement, shared by the image and the text
const slideMotion = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.35 },
};

export default function AuthCarousel() {
  const [index, setIndex] = useState(0);

  const go = (step: number) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  // next slide every 6 seconds; restarts after each click
  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      6000,
    );
    return () => clearTimeout(timer);
  }, [index]);

  const slide = slides[index];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {/* square box: stays still */}
      <Box
        sx={{
          width: 380,
          height: 380,
          borderRadius: "16px",
          bgcolor: "rgba(255,255,255,0.25)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        }}
      >
        {/* image: slides */}
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={slide.image}
            alt=""
            style={{ width: 210, height: "auto" }}
            {...slideMotion}
          />
        </AnimatePresence>
      </Box>

      {/* title and text: slide together with the image */}
      <AnimatePresence mode="wait">
        <motion.div key={index} {...slideMotion}>
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 600,
              fontFamily: '"Google Sans", sans-serif',
              mt: 6,
              textTransform: "capitalize",
            }}
          >
            {slide.title}
          </Typography>
          <Typography
            sx={{
              maxWidth: 550,
              mx: "auto",
              mt: 1,
              opacity: 0.9,
            }}
          >
            {slide.text}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* arrows and dots: stay still */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 12, mt: 5 }}>
        <IconButton
          aria-label="Previous slide"
          onClick={() => go(-1)}
          sx={{ color: "#fff" }}
        >
          <ChevronLeft />
        </IconButton>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                cursor: "pointer",
                height: 10,
                width: i === index ? 28 : 10,
                borderRadius: 999,
                bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.45)",
                transition: "width .3s",
              }}
            />
          ))}
        </Box>
        <IconButton
          aria-label="Next slide"
          onClick={() => go(1)}
          sx={{ color: "#fff" }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}
