import { Box, Typography } from '@mui/material';
import SmilingLady from '../../assets/images/smiling-lady.png';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const portalSteps = [
    'Open the onboarding link shared with your session token.',
    'Your employment type is verified automatically.',
    'You are redirected to the right dashboard to continue onboarding.'
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F4F1EA',
        backgroundImage: 'radial-gradient(circle at top left, rgba(0, 73, 135, 0.18), transparent 32%), linear-gradient(135deg, #F4F1EA 0%, #FAF8F3 45%, #EEF3F8 100%)',
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 },
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1240,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
          gap: { xs: 4, lg: 6 }
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(0, 73, 135, 0.08)',
            backdropFilter: 'blur(14px)',
            borderRadius: 6,
            p: { xs: 4, md: 6 },
            boxShadow: '0 28px 80px rgba(24, 39, 75, 0.10)'
          }}
        >
          <Box
            component="img"
            src="/fsdhlogo.png"
            alt="FSDH logo"
            sx={{
              width: { xs: 150, md: 180 },
              height: 'auto',
              display: 'block',
              mb: 3
            }}
          />

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 2,
              py: 0.75,
              borderRadius: 999,
              bgcolor: '#D7E8F6',
              color: '#004987',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 3
            }}
          >
            Employee Onboarding
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Merriweather, serif',
              fontWeight: 700,
              color: '#14324A',
              fontSize: { xs: '2.4rem', md: '3.4rem' },
              lineHeight: 1.08,
              mb: 2
            }}
          >
            Structured onboarding for every staff journey.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#4F6475',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
              maxWidth: 620,
              mb: 4
            }}
          >
            FSDH Onboarding Portal validates each secure session link, identifies whether the staff is an intern, full staff, or consultant, and sends them directly to the correct dashboard.
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 6,
            bgcolor: '#14324A',
            color: '#F8FBFD',
            p: { xs: 4, md: 5 },
            minHeight: 420,
            boxShadow: '0 28px 80px rgba(20, 50, 74, 0.18)'
          }}
        >

<img src={SmilingLady} alt="Smiling lady" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
          
        </Box>
      </Box>
    </Box>
  );
}
