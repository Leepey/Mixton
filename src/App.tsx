// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './app/providers/AuthProvider';
import { MixerProvider } from './app/providers/MixerProvider';
import { TonConnectProvider } from './app/providers/TonConnectProvider';
import { ThemeProvider } from './styles/theme';

function App() {
  return (
    <ThemeProvider>
      <TonConnectProvider>
        <AuthProvider>
          <MixerProvider>
            <Router>
              <AppRoutes />
            </Router>
          </MixerProvider>
        </AuthProvider>
      </TonConnectProvider>
    </ThemeProvider>
  );
}

export default App;