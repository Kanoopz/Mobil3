// Get API key from environment variables
const API_KEY = 'beta_334ea920d7389188dcddd9ebf505d9f2';

// Create Para client singleton with dynamic loading
let paraInstance: any = null;

const createParaClient = async () => {
  try {
    // Check if we're in a React Native environment
    const { Platform } = require('react-native');
    
    if (Platform.OS === 'web') {
      // Web environment - use mock
      console.log('Web environment detected, using mock Para SDK');
      return createMockClient();
    }
    
    // Native environment - try to load real SDK
    const { ParaMobile, Environment } = await import("@getpara/react-native-wallet");
    console.log('Native environment detected, loading real Para SDK');
    return new ParaMobile(Environment.BETA, API_KEY);
  } catch (error) {
    console.warn('Para SDK not available in this environment:', error);
    console.log('Falling back to mock Para SDK');
    return createMockClient();
  }
};

const createMockClient = () => {
  return {
    init: async () => {
      console.log('Para SDK mock initialized');
      return Promise.resolve();
    },
    // Mock authentication methods for development
    signUpOrLogIn: async (params: any) => {
      console.log('Mock signUpOrLogIn called with:', params);
      // Simulate different responses based on input
      if (params.auth?.email) {
        return { stage: 'verify' };
      } else if (params.auth?.phone) {
        return { stage: 'verify' };
      } else if (params.auth?.oauth) {
        return { stage: 'success' };
      }
      return { stage: 'login' };
    },
    verifyNewAccount: async (params: any) => {
      console.log('Mock verifyNewAccount called with:', params);
      return { stage: 'success' };
    },
    registerPasskey: async (authState: any) => {
      console.log('Mock registerPasskey called with:', authState);
      return Promise.resolve();
    },
    loginWithPasskey: async () => {
      console.log('Mock loginWithPasskey called');
      return { stage: 'success' };
    }
  };
};

export const para = {
  init: async () => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.init();
  },
  
  // Authentication methods
  signUpOrLogIn: async (params: any) => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.signUpOrLogIn(params);
  },
  
  verifyNewAccount: async (params: any) => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.verifyNewAccount(params);
  },
  
  registerPasskey: async (authState: any) => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.registerPasskey(authState);
  },
  
  loginWithPasskey: async () => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.loginWithPasskey();
  },
  
  // Get the instance
  get instance() {
    return paraInstance;
  }
};
