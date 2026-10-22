import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserType = 'fulltime' | 'interns' | 'consultant';

export interface User {
  employeeId: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  userType: UserType;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isHydrated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticatedUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isHydrated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
    },
    setAuthHydrated(state) {
      state.isHydrated = true;
    }
  }
});

export const { setAuthenticatedUser, logout, setAuthHydrated } = authSlice.actions;
export default authSlice.reducer;