import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { SESSION_EXPIRED_EVENT } from './services/api/httpClient';
import ProtectedRoute from './components/ProtectedRoute';
import AuthBootstrap from './components/AuthBootstrap';
// import LandingPage from './pages/auth/LandingPage';
import SessionLanding from './pages/auth/SessionLanding';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/auth/SignIn.tsx';
import NotFoundPage from './pages/NotFound.tsx';
const theme = createTheme({
  palette: {
    primary: {
      main: '#004987'
    }
  },
  typography: {
    fontFamily: 'Avenir, sans-serif',
    h1: {
      fontFamily: 'Merriweather, serif'
    },
    h2: {
      fontFamily: 'Merriweather, serif'
    },
    h3: {
      fontFamily: 'Merriweather, serif'
    },
    h4: {
      fontFamily: 'Merriweather, serif'
    },
    h5: {
      fontFamily: 'Merriweather, serif'
    },
    h6: {
      fontFamily: 'Merriweather, serif'
    }
  }
});
export function App() {
  const [isSessionExpiredToastOpen, setIsSessionExpiredToastOpen] = useState(false);

  useEffect(() => {
    const onSessionExpired = () => {
      setIsSessionExpiredToastOpen(true);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthBootstrap />
          <Snackbar
            open={isSessionExpiredToastOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={() => setIsSessionExpiredToastOpen(false)}
          >
            <Alert
              severity="warning"
              variant="filled"
              sx={{ width: '100%' }}
              onClose={() => setIsSessionExpiredToastOpen(false)}
            >
              Session Expired! Kindly login Again.
            </Alert>
          </Snackbar>
          <Routes>
            {/* Public landing page */}
            <Route path="/" element={<SignIn />} />

            {/* Magic-link verification landing */}
            <Route path="/session/:token" element={<SessionLanding />} />

            {/* Fulltime employee route */}
            <Route
              path="/dashboard"
              element={
              <ProtectedRoute allowedTypes={["fulltime"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

            {/* Intern employee route */}
            <Route
              path="/dboard"
              element={
              <ProtectedRoute allowedTypes={["interns"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

            {/* Consultant route */}
            <Route
              path="/consultant-dashboard"
              element={
              <ProtectedRoute allowedTypes={["consultant"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/testing" element={
              <NotFoundPage/>
              } />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>);

}