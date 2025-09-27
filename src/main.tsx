// src/main.tsx
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ErrorBoundary } from './features/shared/components/ErrorBoundary';
import { AuthProvider } from './features/auth/components/AuthProvider';
import { MixerProvider } from './features/shared/context/MixerContext';
import App from './App';
import theme from './styles/theme';
import './styles/global.css';
import './styles/neon.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TonConnectUIProvider 
            manifestUrl={import.meta.env.VITE_TONCONNECT_MANIFEST_URL}
            actionsConfiguration={{
              twaReturnUrl: 'https://t.me/TONMixerBot',
              modals: ['error'],
              notifications: ['before', 'success', 'error']
            }}
            uiPreferences={{ 
              theme: 'SYSTEM',
              borderRadius: 's'
            }}
            language="en"
          >
            <AuthProvider>
              <MixerProvider>
                <App />
              </MixerProvider>
            </AuthProvider>
          </TonConnectUIProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);