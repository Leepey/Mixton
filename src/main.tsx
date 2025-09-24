// src/main.tsx
// Импортируем полифиллы в самом начале
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import theme from './styles/theme';
import './styles/global.css';
import './styles/neon.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

console.log('🚀 Starting app...');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
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
        // Удаляем объект connector с неподдерживаемыми свойствами
      >
        <App />
      </TonConnectUIProvider>
    </ThemeProvider>
  </React.StrictMode>
);