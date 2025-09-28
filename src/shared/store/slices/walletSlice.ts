import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/contract';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: 0,
  transactions: [],
  isLoading: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetWallet: (state) => {
      state.isConnected = false;
      state.address = null;
      state.balance = 0;
      state.transactions = [];
      state.isLoading = false;
    },
  },
});

export const {
  setConnected,
  setAddress,
  setBalance,
  setTransactions,
  addTransaction,
  setLoading,
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;