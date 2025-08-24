# Mobil3App with Para SDK Integration

This project demonstrates how to integrate the Para SDK with Expo for authentication and wallet management.

## Prerequisites

- Node.js 18+
- iOS Simulator/Device (for iOS development)
- Android Emulator/Device (for Android development)
- Expo CLI

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
EXPO_PUBLIC_PARA_API_KEY=your_api_key_here
EXPO_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

**Important**: 
- Get your API key from [developer.getpara.com](https://developer.getpara.com)
- Get your WalletConnect project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

### 3. Update App Configuration

Before running the app, you need to update the following in `app.json`:

#### For iOS Development:
- Update `bundleIdentifier` with your own bundle identifier
- Update `appleTeamId` with your Apple Developer Team ID
- Register your bundle identifier in the Para developer portal under your API key settings
- Configure the Relying Party ID for passkeys in your Para developer portal

#### For Android Development:
- Update `package` with your own package name
- Android works out of the box for development as it uses the default debug.keystore

### 4. Prebuild Native Projects

**Important**: This example uses native modules (passkeys, crypto) that require prebuild. Expo Go is not supported.

```bash
npx expo prebuild --clean
```

## Running the App

### iOS

```bash
npx expo run:ios
```

**Note**: The iOS version is configured with Para's team ID and will not run locally without modification.

To run on iOS with your own credentials:

1. Update `app.json` with your own:
   - `bundleIdentifier`
   - `appleTeamId`
2. Register your bundle identifier in the Para developer portal under your API key settings
3. Wait up to 24 hours for Apple to recognize the new associated domains

### Android

```bash
npx expo run:android
```

Android works out of the box as it uses the default debug.keystore which is pre-registered for development use.

## Development

If you encounter build issues or modify native dependencies, run:

```bash
npx expo prebuild --clean
```

This regenerates the native iOS and Android projects with the latest configuration.

## Project Structure

```
src/
├── components/
│   ├── ParaLogin.tsx          # Login component with Para authentication
│   └── WalletDashboard.tsx    # Wallet dashboard after authentication
├── contexts/
│   └── ParaContext.tsx        # React context for Para SDK state management
└── services/
    └── ParaSDK.ts             # Para SDK service implementation
```

## Features

- **Passkey Authentication**: Secure, passwordless authentication using Para's passkey system
- **Wallet Management**: Display wallet information and balance
- **User Management**: Handle user authentication state
- **Transaction Support**: Framework for sending transactions (mock implementation)

## Integration Notes

This implementation includes:

1. **Para SDK Service** (`src/services/ParaSDK.ts`): A mock implementation of the Para SDK that demonstrates the expected interface and functionality.

2. **React Context** (`src/contexts/ParaContext.tsx`): Manages authentication state and provides hooks for components.

3. **Login Component** (`src/components/ParaLogin.tsx`): Handles user authentication with Para.

4. **Wallet Dashboard** (`src/components/WalletDashboard.tsx`): Displays user and wallet information after authentication.

## Important Notes

- **Native Modules**: This integration requires native modules for passkeys and crypto functionality.
- **Expo Go**: Not supported due to native module requirements.
- **API Key**: You must obtain a valid API key from Para's developer portal.
- **Bundle Configuration**: iOS requires proper bundle identifier and team ID configuration.
- **Current Status**: This is a mock implementation that demonstrates the integration pattern. The actual Para SDK package may not be publicly available yet.

## Current Implementation Status

This project includes the proper Para SDK integration setup with:

✅ **Completed Features:**
- ParaProvider component with proper configuration structure
- Relying Party ID configuration for passkeys
- Environment variable setup for API keys
- Metro configuration with web-compatible crypto polyfills
- App configuration for iOS and Android with proper URL schemes
- TypeScript configuration
- Crypto dependency issues resolved

✅ **Current Status:**
- Para SDK (`@getpara/react-native-wallet`) successfully installed and working
- Para Wallet shim imported for all platforms
- Para client singleton created with general configuration
- Web-compatible crypto polyfills installed and configured
- Metro configuration optimized for cross-platform compatibility
- Development server running successfully
- API key configured: `beta_334ea920d7389188dcddd9ebf505d9f2`
- Universal implementation: Works across all platforms (Web, iOS, Android)

🔄 **Next Steps for Production:**
1. Replace the mock ParaProvider with the actual Para SDK provider
2. Configure real API endpoints and authentication flows
3. Set up proper bundle identifiers and team IDs for iOS
4. Test with actual Para developer credentials
5. Configure WalletConnect project ID

## Documentation

For more information about the Para SDK, visit [docs.getpara.com](https://docs.getpara.com).

## Troubleshooting

### Common Issues

1. **Build Errors**: Run `npx expo prebuild --clean` to regenerate native projects
2. **iOS Signing Issues**: Ensure your bundle identifier and team ID are correctly configured
3. **API Key Issues**: Verify your API key is correctly set in `.env.local`

### Getting Help

- Check the [Para SDK documentation](https://docs.getpara.com)
- Visit the [Para developer portal](https://developer.getpara.com)
- Review Expo's [native module documentation](https://docs.expo.dev/guides/native-modules/)
