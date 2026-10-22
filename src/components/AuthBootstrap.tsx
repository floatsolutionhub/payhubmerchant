import { useEffect } from 'react';
import { setApiAccessToken } from '../services/api';
import { useAppDispatch } from '../store';
import { logout, setAuthenticatedUser, setAuthHydrated, type User } from '../store/authSlice';
import { setOnboardingPrefill } from '../store/onboardingSlice';
import {
  SESSION_EMPLOYEE_ID_KEY,
  SESSION_ONBOARDING_PREFILL_KEY,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY
} from '../config/sessionKeys';

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const userText = window.localStorage.getItem(SESSION_USER_KEY);
      const accessToken = window.localStorage.getItem(SESSION_TOKEN_KEY);
      const employeeId = window.localStorage.getItem(SESSION_EMPLOYEE_ID_KEY);
      const onboardingPrefillText = window.localStorage.getItem(SESSION_ONBOARDING_PREFILL_KEY);

      if (!userText) {
        dispatch(logout());
        return;
      }

      const user = JSON.parse(userText) as User;
      const hydratedUser: User = {
        ...user,
        employeeId: user.employeeId || employeeId || undefined
      };
      dispatch(setAuthenticatedUser(hydratedUser));

      if (onboardingPrefillText) {
        const parsedPrefill = JSON.parse(onboardingPrefillText) as Record<string, string>;
        dispatch(setOnboardingPrefill(parsedPrefill));
      }

      setApiAccessToken(accessToken || null);
    } catch {
      dispatch(setAuthHydrated());
      setApiAccessToken(null);
    }
  }, [dispatch]);

  return null;
}
