// src/app/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { store, persistor } from '../shared/store';
import { ThemeProvider } from '../shared/context/ThemeContext';
import { AuthProvider } from '../shared/context/AuthContext';
import { WalletProvider } from '../shared/context/WalletContext';
import { AppProvider } from '../shared/context/AppContext';

import { AppRoutes } from '../shared/components/Routes';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <TonConnectUIProvider manifestUrl="https://your-domain.com/tonconnect-manifest.json">
            <ThemeProvider>
              <AuthProvider>
                <WalletProvider>
                  <AppProvider>
                    <AppRoutes />
                  </AppProvider>
                </WalletProvider>
              </AuthProvider>
            </ThemeProvider>
          </TonConnectUIProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;