// Get API key from environment variables
const API_KEY = 'beta_334ea920d7389188dcddd9ebf505d9f2';

// Create Para client singleton with dynamic loading
let paraInstance: any = null;

const createParaClient = async () => {
  try {
    const { ParaMobile, Environment } = await import("@getpara/react-native-wallet");
    return new ParaMobile(Environment.BETA, API_KEY);
  } catch (error) {
    console.warn('Para SDK not available in this environment:', error);
    // Return a mock client for environments where Para SDK isn't available
    return {
      init: async () => {
        console.log('Para SDK mock initialized');
        return Promise.resolve();
      }
    };
  }
};

export const para = {
  init: async () => {
    if (!paraInstance) {
      paraInstance = await createParaClient();
    }
    return paraInstance.init();
  },
  // Add other methods as needed
  get instance() {
    return paraInstance;
  }
};
