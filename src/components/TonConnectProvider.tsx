// src/components/TonConnectProvider.tsx
import React from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonConnectErrorBoundary } from './TonConnectErrorBoundary';

interface TonConnectProviderProps {
  children: React.ReactNode;
}

const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {
  return (
    <TonConnectErrorBoundary>
      <TonConnectUIProvider 
        manifestUrl={import.meta.env.VITE_TONCONNECT_MANIFEST_URL}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/TONMixerBot'
        }}
        uiPreferences={{ 
          theme: 'SYSTEM' 
        }}
        language="en"
      >
        {children}
      </TonConnectUIProvider>
    </TonConnectErrorBoundary>
  );
};

export default TonConnectProvider;