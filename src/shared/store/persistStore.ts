import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { rootReducer } from './store';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'wallet'], // Только эти редьюсеры будут сохраняться
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const persistor = persistStore(store);