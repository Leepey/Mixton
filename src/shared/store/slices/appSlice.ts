import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../../types/app';

const initialState: AppState = {
  isLoading: false,
  error: null,
  theme: 'light',
  language: 'en',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ru' | 'zh'>) => {
      state.language = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setTheme,
  setLanguage,
  clearError,
} = appSlice.actions;

export default appSlice.reducer;