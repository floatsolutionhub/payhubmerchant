import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';

interface OnboardingState {
  prefillData: Record<string, string>;
}

const initialState: OnboardingState = {
  prefillData: {}
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingPrefill(state, action: PayloadAction<Record<string, string>>) {
      state.prefillData = action.payload;
    },
    clearOnboardingPrefill(state) {
      state.prefillData = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.prefillData = {};
    });
  }
});

export const { setOnboardingPrefill, clearOnboardingPrefill } = onboardingSlice.actions;
export default onboardingSlice.reducer;
