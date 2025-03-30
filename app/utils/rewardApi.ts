import { Alert } from 'react-native';

// Declare the global variable for TypeScript
declare global {
  var __TEST_API_URL__: string | undefined;
}

/**
 * Utility function to call the reward endpoint.
 */
export const rewardUser = async (token: string, amount: number, userId: string) => {
  // Determine base URL based on environment
  const isTest = process.env.JEST_WORKER_ID !== undefined;
  const baseUrl = isTest ? __TEST_API_URL__ : process.env.EXPO_PUBLIC_PL_BASE_URL;

  if (!baseUrl) {
    console.error('API Base URL is not configured.');
    // Only show Alert if not in test environment
    if (!isTest) {
      Alert.alert('Error', 'Cannot process reward: API configuration missing.');
    }
    return; // Stop execution if no base URL
  }

  const url = `${baseUrl}/api/rewards/grant`; // Updated endpoint path
  
  try {
    const response = await fetch(url, {
      method: 'POST', // Changed to POST as per common practice for granting rewards
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, userId }), // Send data in the body
    });

    if (!response.ok) {
      // Try to parse error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage; // Use message from backend if available
      } catch (e) {
        // Ignore if response is not JSON or error parsing
      }
      throw new Error(errorMessage);
    }

    // Assuming the API returns some confirmation or data
    const result = await response.json(); 
    console.log('Reward API call successful:', result); // Log success

    // Only show Alert if not in test environment
    if (!isTest) {
      Alert.alert('Reward Granted!', `You earned ${amount} PLT!`);
    }

  } catch (error: any) {
    console.error('Reward API call failed:', error);
    // Only show Alert if not in test environment
    if (!isTest) {
      Alert.alert('Reward Error', error.message || 'An unknown error occurred.');
    }
  }
};

// Add a default export that includes all the utility functions
const rewardAPI = {
  rewardUser,
};

export default rewardAPI;
