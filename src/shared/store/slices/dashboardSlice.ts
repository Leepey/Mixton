import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalMixed: number;
  totalUsers: number;
  totalPools: number;
  activeTransactions: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
}

interface DashboardState {
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalMixed: 0,
    totalUsers: 0,
    totalPools: 0,
    activeTransactions: 0,
    dailyVolume: 0,
    weeklyVolume: 0,
    monthlyVolume: 0,
  },
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateStat: (state, action: PayloadAction<keyof DashboardStats>) => {
      // Здесь можно добавить логику обновления конкретной статистики
    },
  },
});

export const {
  setStats,
  setLoading,
  setError,
  updateStat,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;