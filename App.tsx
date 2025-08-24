/**
 * Mobil3App with Para SDK Integration
 * https://github.com/facebook/react-native
 *
 * @format
 */

// Dynamic shim import for cross-platform compatibility
const loadParaShim = async () => {
  try {
    const { Platform } = require('react-native');
    
    if (Platform.OS !== 'web') {
      // Only load shim on native platforms
      await import("@getpara/react-native-wallet/shim");
      console.log('Para shim loaded successfully for', Platform.OS);
    } else {
      console.log('Skipping Para shim for web platform');
    }
  } catch (error) {
    console.warn('Para shim not available in this environment:', error);
  }
};

// Load shim immediately
loadParaShim();
import React, { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ParaProvider, Environment } from './src/components/ParaProvider';
import { AuthScreen } from './src/components/AuthScreen';
import { para } from './src/para';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize Para client
  useEffect(() => {
    const initPara = async () => {
      try {
        await para.init();
        console.log('✅ Para client initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Para client:', error);
      }
    };

    initPara();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ParaProvider
        paraClientConfig={{
          env: Environment.BETA, // or Environment.PROD for production apps
          apiKey: process.env.EXPO_PUBLIC_PARA_API_KEY || 'YOUR_API_KEY',
        }}
        externalWalletConfig={{
          appName: 'Mobil3App2-Expo',
          wallets: ["METAMASK", "PHANTOM", "WALLETCONNECT"],
          walletConnect: { projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID' },
        }}
        paraModalConfig={{
          oAuthMethods: [],
          authLayout: ["AUTH:FULL", "EXTERNAL:CONDENSED"],
          recoverySecretStepEnabled: true,
          onRampTestMode: true
        }}
      >
        <AppContent />
      </ParaProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {isAuthenticated ? (
        <View style={styles.content}>
          <Text style={styles.title}>Mobil3App with Para SDK</Text>
          <Text style={styles.subtitle}>
            Para SDK integration with proper Relying Party ID configuration
          </Text>
          <Text style={styles.info}>
            Check the console for configuration validation messages
          </Text>
        </View>
      ) : (
        <AuthScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default App;
