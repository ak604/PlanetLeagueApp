import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { tokenService } from '../services/TokenService';
import { useAuth } from './AuthContext';

interface TokenContextType {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  walletAddress: string | null;
  setWalletAddress: (address: string) => void;
  refreshBalance: (walletAddress?: string) => Promise<void>;
  lastUpdated: Date | null;
}

// Create context with default values
const TokenContext = createContext<TokenContextType>({
  balance: null,
  isLoading: false,
  error: null,
  walletAddress: null,
  setWalletAddress: () => {},
  refreshBalance: async () => {},
  lastUpdated: null,
});

// Default wallet address for fallback (should be replaced by actual user wallet)
const DEFAULT_WALLET = '0x2BBd30A8f9B880eDBBAc1eeB35c91Cad4Ab5511a';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION_MS = 5 * 60 * 1000;

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();
  
  // Get wallet address from context state, user object, or fallback to default
  const getWalletAddress = useCallback(() => {
    // First priority: explicitly set wallet address from API
    if (walletAddress && tokenService.isValidAddress(walletAddress)) {
      return walletAddress;
    }
    
    // Second priority: user's wallet address if available
    if (user?.walletAddress && tokenService.isValidAddress(user.walletAddress)) {
      return user.walletAddress;
    }
    
    // Fallback to default for demo purposes
    return DEFAULT_WALLET;
  }, [user, walletAddress]);

  // Check if cache is expired
  const isCacheExpired = useCallback(() => {
    if (!lastUpdated) return true;
    const now = new Date();
    return now.getTime() - lastUpdated.getTime() > CACHE_DURATION_MS;
  }, [lastUpdated]);

  // Function to refresh token balance
  const refreshBalance = useCallback(async (specificWalletAddress?: string) => {
    // Skip refresh if we already have a recent balance and no specific address is requested
    if (balance !== null && !specificWalletAddress && !isCacheExpired()) {
      console.log('Using cached balance', balance);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use provided wallet address, or get from context state/user
      const address = specificWalletAddress || getWalletAddress();
      
      if (!address) {
        throw new Error('No wallet address available');
      }
      
      console.log(`Fetching PLT balance for wallet: ${address}`);
      
      // Fetch balance from blockchain with error handling in the service
      const newBalance = await tokenService.getTokenBalance(address);
      
      // Update state
      setBalance(newBalance);
      setLastUpdated(new Date());
      
      // If we used a specific wallet address, update the context state
      if (specificWalletAddress && tokenService.isValidAddress(specificWalletAddress)) {
        setWalletAddress(specificWalletAddress);
      }
      
      return newBalance;
    } catch (err: any) {
      console.error('Error refreshing token balance:', err);
      setError(err.message || 'Failed to fetch token balance');
      // If there's an error, we don't want to display 0
      // but keep the previous balance if available
      return balance;
    } finally {
      setIsLoading(false);
    }
  }, [getWalletAddress, balance, isCacheExpired]);

  // Fetch balance when user or walletAddress changes, or when cache expires
  useEffect(() => {
    if (user && (balance === null || isCacheExpired())) {
      refreshBalance();
    }
  }, [user, walletAddress, refreshBalance, balance, isCacheExpired]);

  const value = {
    balance,
    isLoading,
    error,
    walletAddress,
    setWalletAddress,
    refreshBalance,
    lastUpdated,
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the token context
export const useToken = () => useContext(TokenContext); 