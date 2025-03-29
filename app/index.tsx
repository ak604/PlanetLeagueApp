import { Redirect } from 'expo-router';
import { useAuth } from './context/AuthContext';

// This is just a redirect page based on authentication status
// We'll let the _layout.tsx file handle the actual navigation logic
export default function Index() {
  const { userToken, isLoading } = useAuth();

  // During initial load, don't redirect yet
  if (isLoading) {
    return null;
  }

  // Redirect based on authentication status
  return userToken 
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/(auth)/login" />;
} 