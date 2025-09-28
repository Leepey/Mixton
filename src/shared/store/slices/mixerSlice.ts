import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PoolContract, Transaction } from '../../types/contract';

interface MixerState {
  pools: PoolContract[];
  selectedPool: PoolContract | null;
  isMixing: boolean;
  mixHistory: Transaction[];
  currentMix: Transaction | null;
}

const initialState: MixerState = {
  pools: [],
  selectedPool: null,
  isMixing: false,
  mixHistory: [],
  currentMix: null,
};

const mixerSlice = createSlice({
  name: 'mixer',
  initialState,
  reducers: {
    setPools: (state, action: PayloadAction<PoolContract[]>) => {
      state.pools = action.payload;
    },
    setSelectedPool: (state, action: PayloadAction<PoolContract | null>) => {
      state.selectedPool = action.payload;
    },
    setMixing: (state, action: PayloadAction<boolean>) => {
      state.isMixing = action.payload;
    },
    addToMixHistory: (state, action: PayloadAction<Transaction>) => {
      state.mixHistory.unshift(action.payload);
    },
    setMixHistory: (state, action: PayloadAction<Transaction[]>) => {
      state.mixHistory = action.payload;
    },
    setCurrentMix: (state, action: PayloadAction<Transaction | null>) => {
      state.currentMix = action.payload;
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: Transaction['status'] }>) => {
      const { id, status } = action.payload;
      const transaction = state.mixHistory.find(t => t.id === id);
      if (transaction) {
        transaction.status = status;
      }
      if (state.currentMix?.id === id) {
        state.currentMix.status = status;
      }
    },
  },
});

export const {
  setPools,
  setSelectedPool,
  setMixing,
  addToMixHistory,
  setMixHistory,
  setCurrentMix,
  updateTransactionStatus,
} = mixerSlice.actions;

export default mixerSlice.reducer;