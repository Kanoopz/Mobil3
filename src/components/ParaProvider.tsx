import React, { ReactNode } from 'react';
import { View } from 'react-native';

// Environment enum for Para SDK
export enum Environment {
  BETA = 'beta',
  PROD = 'prod'
}

// Configuration interfaces
interface ParaClientConfig {
  env: Environment;
  apiKey: string;
}

interface ExternalWalletConfig {
  appName: string;
  wallets: string[];
  walletConnect: {
    projectId: string;
  };
}

interface ParaModalConfig {
  oAuthMethods: string[];
  authLayout: string[];
  recoverySecretStepEnabled: boolean;
  onRampTestMode: boolean;
}

interface ParaProviderProps {
  paraClientConfig: ParaClientConfig;
  externalWalletConfig: ExternalWalletConfig;
  paraModalConfig: ParaModalConfig;
  children: ReactNode;
}

// Mock ParaProvider component - replace with actual Para SDK when available
export const ParaProvider: React.FC<ParaProviderProps> = ({
  paraClientConfig,
  externalWalletConfig,
  paraModalConfig,
  children
}) => {
  // Validate configuration
  React.useEffect(() => {
    console.log('Para SDK Configuration:', {
      client: paraClientConfig,
      wallet: externalWalletConfig,
      modal: paraModalConfig
    });
    
    // Validate API key
    if (!paraClientConfig.apiKey || paraClientConfig.apiKey === 'YOUR_API_KEY') {
      console.warn('⚠️ Please set a valid Para API key in your configuration');
    }
    
    // Validate WalletConnect project ID
    if (!externalWalletConfig.walletConnect.projectId || 
        externalWalletConfig.walletConnect.projectId === 'YOUR_WALLET_CONNECT_PROJECT_ID') {
      console.warn('⚠️ Please set a valid WalletConnect project ID');
    }
    
    // Validate app name
    if (!externalWalletConfig.appName || 
        externalWalletConfig.appName === 'YOUR_APP_NAME') {
      console.warn('⚠️ Please set your app name in the configuration');
    }
  }, [paraClientConfig, externalWalletConfig, paraModalConfig]);

  // For now, just render children with a context wrapper
  // This will be replaced with the actual Para SDK provider
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};

// Export the Environment enum for use in App.tsx
