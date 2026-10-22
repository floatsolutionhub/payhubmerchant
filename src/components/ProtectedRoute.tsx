import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
import type { UserType } from '../store/authSlice';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes: UserType[];
}
export default function ProtectedRoute({
  children,
  allowedTypes
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isHydrated } = useAppSelector((state) => state.auth);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || !allowedTypes.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}