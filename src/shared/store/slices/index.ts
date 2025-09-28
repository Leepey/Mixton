import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import mixerReducer from './mixerSlice';
import walletReducer from './walletSlice';
import dashboardReducer from './dashboardSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  mixer: mixerReducer,
  wallet: walletReducer,
  dashboard: dashboardReducer,
});