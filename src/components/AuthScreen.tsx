import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { para } from '../para';

interface AuthState {
  stage: 'input' | 'verify' | 'login' | 'success';
  email?: string;
  phone?: string;
  authMethod?: 'email' | 'phone' | 'oauth';
}

export const AuthScreen: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ stage: 'input' });
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  // Email Authentication
  const handleEmailContinue = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const result = await para.signUpOrLogIn({ auth: { email } });
      
      if (result?.stage === 'verify') {
        // New user - show OTP verification
        setAuthState({ stage: 'verify', email, authMethod: 'email' });
        setShowOTP(true);
      } else if (result?.stage === 'login') {
        // Existing user - proceed with passkey login
        setAuthState({ stage: 'login', email, authMethod: 'email' });
        await handlePasskeyLogin();
      }
    } catch (error) {
      Alert.alert('Authentication Error', error instanceof Error ? error.message : 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  // Phone Authentication
  const handlePhoneContinue = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await para.signUpOrLogIn({ auth: { phone } });
      
      if (result?.stage === 'verify') {
        // New user - show OTP verification
        setAuthState({ stage: 'verify', phone, authMethod: 'phone' });
        setShowOTP(true);
      } else if (result?.stage === 'login') {
        // Existing user - proceed with passkey login
        setAuthState({ stage: 'login', phone, authMethod: 'phone' });
        await handlePasskeyLogin();
      }
    } catch (error) {
      Alert.alert('Authentication Error', error instanceof Error ? error.message : 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  // OAuth Authentication
  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    try {
      const result = await para.signUpOrLogIn({ 
        auth: { 
          oauth: { 
            provider,
            redirectUri: 'your-app-scheme://oauth-callback' // Update with your app's scheme
          } 
        } 
      });
      
      if (result?.stage === 'success') {
        setAuthState({ stage: 'success', authMethod: 'oauth' });
      }
    } catch (error) {
      Alert.alert('OAuth Error', error instanceof Error ? error.message : 'Failed to authenticate with OAuth');
    } finally {
      setLoading(false);
    }
  };

  // Passkey Login
  const handlePasskeyLogin = async () => {
    try {
      const result = await para.loginWithPasskey();
      if (result?.stage === 'success') {
        setAuthState({ stage: 'success' });
      }
    } catch (error) {
      Alert.alert('Passkey Error', error instanceof Error ? error.message : 'Failed to login with passkey');
    }
  };

  // Verification Code
  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const result = await para.verifyNewAccount({ verificationCode });
      await para.registerPasskey(result);
      setAuthState({ stage: 'success' });
    } catch (error) {
      Alert.alert('Verification Error', error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  // Reset to input stage
  const handleBack = () => {
    setAuthState({ stage: 'input' });
    setShowOTP(false);
    setVerificationCode('');
  };

  // Render different stages
  const renderInputStage = () => (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo and Header */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>M3</Text>
        </View>
        <Text style={styles.title}>Welcome to Mobil3</Text>
        <Text style={styles.subtitle}>Secure wallet authentication</Text>
      </View>

      {/* Email Authentication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📧 Email Authentication</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleEmailContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue with Email</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      <Text style={styles.orText}>OR</Text>

      {/* Phone Authentication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Phone Authentication</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handlePhoneContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue with Phone</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      <Text style={styles.orText}>OR</Text>

      {/* OAuth Authentication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 OAuth Authentication</Text>
        <TouchableOpacity
          style={[styles.button, styles.oauthButton]}
          onPress={() => handleOAuthLogin('google')}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.oauthButton]}
          onPress={() => handleOAuthLogin('apple')}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Continue with Apple</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderVerificationStage = () => (
    <View style={styles.container}>
      {/* Logo and Header */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🔐</Text>
        </View>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={{ fontWeight: '600', color: '#fff' }}>
            {authState.email || authState.phone}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Enter Verification Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 6-digit code"
          placeholderTextColor="#999"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          style={[styles.input, { fontSize: 24, fontWeight: 'bold', letterSpacing: 8 }]}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back to Authentication</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuccessStage = () => (
    <View style={styles.container}>
      {/* Logo and Header */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🎉</Text>
        </View>
        <Text style={styles.title}>Authentication Successful!</Text>
        <Text style={styles.subtitle}>Welcome to your secure wallet</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Wallet Ready</Text>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={{
          textAlign: 'center',
          fontSize: 18,
          color: '#2c3e50',
          marginTop: 20,
          fontWeight: '600'
        }}>
          Your wallet is now secure and ready to use!
        </Text>
        <Text style={{
          textAlign: 'center',
          fontSize: 14,
          color: '#7f8c8d',
          marginTop: 10,
          lineHeight: 20
        }}>
          You can now send, receive, and manage your digital assets with complete security.
        </Text>
      </View>
    </View>
  );

  // Render based on current stage
  switch (authState.stage) {
    case 'verify':
      return renderVerificationStage();
    case 'success':
      return renderSuccessStage();
    default:
      return renderInputStage();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e8f4fd',
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  oauthButton: {
    backgroundColor: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    marginTop: 25,
    alignItems: 'center',
    padding: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  successIconText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
  },
  orText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 15,
  },
});
