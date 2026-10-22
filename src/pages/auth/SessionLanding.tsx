import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { setApiAccessToken } from '../../services/api';
import { employeesService } from '../../services/api/employeesService';
import { useAppDispatch } from '../../store';
import { logout, setAuthenticatedUser, type User, type UserType } from '../../store/authSlice';
import { setOnboardingPrefill } from '../../store/onboardingSlice';
import {
  SESSION_EMPLOYEE_ID_KEY,
  SESSION_ONBOARDING_PREFILL_KEY,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY
} from '../../config/sessionKeys';
import { buildOnboardingPrefillData, extractEmployeeId } from '../../services/onboardingPrefill';
const USE_MOCK_TOKEN = String(import.meta.env.VITE_USE_MOCK_TOKEN || 'false').toLowerCase() === 'true';
const MOCK_EMPLOYEE_TYPE = String(import.meta.env.VITE_MOCK_EMPLOYEE_TYPE || 'fulltime');
const TEMP_FALLBACK_EMPLOYEE_ID = 'e59089f8-0b75-48cc-9830-4c9414b26328';


function mapEmployeeType(value: string): UserType {
  const normalized = value.toLowerCase();

  if (normalized.includes('intern')) {
    return 'interns';
  }

  if (normalized.includes('consult')) {
    return 'consultant';
  }

  return 'fulltime';
}

function routeForType(userType: UserType): string {
  if (userType === 'interns') {
    return '/dboard';
  }

  if (userType === 'consultant') {
    return '/consultant-dashboard';
  }

  return '/dashboard';
}

function createUserFromPayload(payload: Record<string, unknown>): User {
  const userData =
    typeof payload.userData === 'object' && payload.userData !== null && !Array.isArray(payload.userData)
      ? (payload.userData as Record<string, unknown>)
      : {};
  const employeeTypeText = String(
    userData.category ?? payload.employeeType ?? payload.userType ?? payload.category ?? 'fulltime'
  );
  const employeeId =
    extractEmployeeId(userData) || extractEmployeeId(payload) || TEMP_FALLBACK_EMPLOYEE_ID;
  const userType = mapEmployeeType(employeeTypeText);
  const compositeName = [userData.firstName, userData.otherName, userData.surname]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
  const resolvedName = String(payload.fullName ?? payload.name ?? compositeName).trim();
  const name = resolvedName || 'FSDH Employee';
  const email = String(
    userData.workEmail ?? userData.personalEmail ?? payload.email ?? 'employee@fsdhgroup.com'
  );

  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'EM';

  return {
    employeeId: employeeId || '',
    name,
    email,
    role: employeeTypeText,
    initials,
    userType
  };
}

function persistSession(user: User, accessToken: string, onboardingPrefill: Record<string, string>) {
  window.localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  window.localStorage.setItem(SESSION_ONBOARDING_PREFILL_KEY, JSON.stringify(onboardingPrefill));

  if (user.employeeId) {
    window.localStorage.setItem(SESSION_EMPLOYEE_ID_KEY, user.employeeId);
  } else {
    window.localStorage.removeItem(SESSION_EMPLOYEE_ID_KEY);
  }

  if (accessToken) {
    window.localStorage.setItem(SESSION_TOKEN_KEY, accessToken);
    setApiAccessToken(accessToken);
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  setApiAccessToken(null);
}

function clearPersistedSession() {
  window.localStorage.removeItem(SESSION_USER_KEY);
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_EMPLOYEE_ID_KEY);
  window.localStorage.removeItem(SESSION_ONBOARDING_PREFILL_KEY);
  setApiAccessToken(null);
}

export default function SessionLanding() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('Verifying session...');
const {token} = useParams();

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      if (USE_MOCK_TOKEN) {
        setMessage('Verifying session (mock mode)...');

        const user = createUserFromPayload({
          name: 'John Okafor',
          email: 'john.okafor@fsdhgroup.com',
          employeeType: MOCK_EMPLOYEE_TYPE
        });
        const mockPrefill = buildOnboardingPrefillData({
          firstName: 'John',
          surname: 'Okafor',
          emailAddress: 'john.okafor@fsdhgroup.com',
          email: 'john.okafor@fsdhgroup.com',
          telephoneNumber: '08000000000'
        });

        persistSession(user, 'mock-access-token', mockPrefill);
        dispatch(setAuthenticatedUser(user));
        dispatch(setOnboardingPrefill(mockPrefill));

        if (mounted) {
          navigate(routeForType(user.userType), { replace: true });
        }

        return;
      }

      if (!token) {
        setMessage('Session token is missing or has expired.');
        clearPersistedSession();
        dispatch(logout());
        return;
      }

      try {
        const response = await employeesService.verifyMagicLink(token);
        const responsePayload = (response?.data ?? response) as Record<string, unknown>;
        const payload = (
          (responsePayload?.value as Record<string, unknown> | undefined) ?? responsePayload
        ) as Record<string, unknown>;
        const userDataPayload =
          typeof payload.userData === 'object' && payload.userData !== null && !Array.isArray(payload.userData)
            ? (payload.userData as Record<string, unknown>)
            : {};
        const mergedPayload = {
          ...responsePayload,
          ...payload
        };
        const user = createUserFromPayload(mergedPayload);
        const accessToken = String(
          payload.token ??
            payload.accessToken ??
            responsePayload.token ??
            responsePayload.accessToken ??
            ''
        );
        const employeeId =
          extractEmployeeId(userDataPayload) ||
          extractEmployeeId(payload) ||
          extractEmployeeId(responsePayload) ||
          TEMP_FALLBACK_EMPLOYEE_ID;
        let onboardingPrefill = buildOnboardingPrefillData(responsePayload, payload, userDataPayload);

        if (accessToken) {
          setApiAccessToken(accessToken);
        }

        if (employeeId) {
          try {
            const fullRecordResponse = await employeesService.getEmployeeFullRecord<unknown>(employeeId);
            onboardingPrefill = {
              ...onboardingPrefill,
              ...buildOnboardingPrefillData(fullRecordResponse)
            };
          } catch {
            // If full record is unavailable, continue with token payload prefill.
          }
        }

        persistSession(user, accessToken, onboardingPrefill);

        dispatch(setAuthenticatedUser(user));
        dispatch(setOnboardingPrefill(onboardingPrefill));

        if (mounted) {
          navigate(routeForType(user.userType), { replace: true });
        }
      } catch {
        if (!mounted) {
          return;
        }

        setMessage('Unable to verify session. This magic link may have expired.');
        clearPersistedSession();
        dispatch(logout());
      }
    };

    void verifySession();

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate, token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#F9FAFB',
        px: 3
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box
          component="img"
          src="/fsdhlogo.png"
          alt="FSDH logo"
          sx={{
            width: { xs: 160, md: 190 },
            height: 'auto',
            display: 'block',
            mx: 'auto',
            mb: 3
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Merriweather, serif',
            fontWeight: 700,
            color: '#004987',
            mb: 1
          }}
        >
          Welcome to FSDH Onboarding Portal
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280', mb: 3 }}>
          {message}
        </Typography>
        <CircularProgress />
      </Box>
    </Box>
  );
}
