import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useToken } from '../context/TokenContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NFTCard from '../components/NFTCard';
import { PLTTokenIcon } from '../components/ui/PLTTokenIcon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { LoadingScreen } from '../components/LoadingScreen';

// Define types for NFTs
type NFTRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

interface NFT {
  id: string;
  name: string;
  rarity: NFTRarity;
  equipped: boolean;
  image: any; // Using any for simplicity, but ideally would be more specific
}

// Mock NFT data
const MOCK_NFTS: NFT[] = [
  { id: 'nft1', name: 'Cosmic Helmet', rarity: 'Rare', equipped: true, image: require('../../assets/images/nfts/cosmic-helmet.png') },
  { id: 'nft2', name: 'Space Gloves', rarity: 'Uncommon', equipped: false, image: require('../../assets/images/nfts/space-gloves.png') },
  { id: 'nft3', name: 'Nebula Shield', rarity: 'Epic', equipped: false, image: { uri: 'https://placehold.co/400x400/9C27B0/FFFFFF?text=Nebula+Shield' } },
  { id: 'nft4', name: 'Star Boots', rarity: 'Common', equipped: false, image: { uri: 'https://placehold.co/400x400/FBBC05/FFFFFF?text=Star+Boots' } },
];

// Mock game history data
const GAME_HISTORY = [
  { id: 'g1', game: 'Space Race', date: '2023-11-10', score: 2450, result: 'Won' },
  { id: 'g2', game: 'Crypto Crash', date: '2023-11-09', score: 1800, result: 'Lost' },
  { id: 'g3', game: 'Token Blast', date: '2023-11-08', score: 3200, result: 'Won' },
  { id: 'g4', game: 'Space Race', date: '2023-11-07', score: 2100, result: 'Won' },
  { id: 'g5', game: 'Crypto Crash', date: '2023-11-06', score: 1950, result: 'Lost' },
];

export default function ProfileScreen() {
  const { user, signOut, isLoading: authLoading, gameData } = useAuth();
  const { 
    balance, 
    isLoading: tokenLoading, 
    refreshBalance, 
    setWalletAddress,
    walletAddress: currentWalletAddress,
    lastUpdated,
    error: tokenError
  } = useToken();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'nfts'>('stats');
  const [nfts, setNfts] = useState<NFT[]>(MOCK_NFTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingMessage('Connecting to servers...');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingProgress(0.2);
      setLoadingMessage('Fetching profile data...');
      
      // Simulate profile data loading and fetch wallet address
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the wallet address from gameData rather than hardcoding it
      if (gameData && gameData.walletAddress) {
        // Set the wallet address first
        setWalletAddress(gameData.walletAddress);
        
        // Then refresh the balance using this address
        await refreshBalance(gameData.walletAddress);
      } else {
        console.warn('No wallet address found in gameData. Check if gameData was loaded correctly.');
        // Fallback to current wallet address if already set
        if (currentWalletAddress) {
          await refreshBalance(currentWalletAddress);
        }
      }
      
      setLoadingProgress(0.5);
      setLoadingMessage('Loading game history...');
      
      // Simulate game history loading
      await new Promise(resolve => setTimeout(resolve, 700));
      setLoadingProgress(0.7);
      setLoadingMessage('Loading NFT collection...');
      
      // Simulate NFT data loading
      await new Promise(resolve => setTimeout(resolve, 1200));
      setLoadingProgress(0.9);
      setLoadingMessage('Connecting to blockchain...');
      
      setLoadingProgress(1);
      
      // Wait a moment at 100% for visual feedback
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data when component mounts
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const handleSignOut = () => {
    signOut();
  };

  const handleEquipNFT = (nftId: string) => {
    setNfts(nfts.map(nft => ({
      ...nft,
      equipped: nft.id === nftId
    })));
  };

  const handleSellNFT = (nftId: string) => {
    // In a real app, this would open a confirmation dialog and call an API
    console.log(`Selling NFT ${nftId}`);
  };

  const handleRefresh = () => {
    loadUserData();
  };

  const renderProfileTab = () => {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Profile</Text>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Email</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.email || 'Not available'}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>User ID</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.id || 'Not available'}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Wallet</Text>
            <Text 
              style={[styles.statValue, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {currentWalletAddress || 'Not connected'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.primary, marginTop: Theme.spacing.lg, alignSelf: 'center' }]}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderStatsTab = () => {
    const { walletAddress, lastUpdated, error: tokenError } = useToken();
    
    const handleTokenRefresh = () => {
      if (walletAddress) {
        refreshBalance(walletAddress);
      } else {
        refreshBalance();
      }
    };
    
    // Format the last updated time
    const getLastUpdatedText = () => {
      if (!lastUpdated) return 'Never updated';
      
      // Format as relative time (e.g., "5 minutes ago")
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      
      if (diffMs < 60000) { // Less than a minute
        return 'Just now';
      } else if (diffMs < 3600000) { // Less than an hour
        const minutes = Math.floor(diffMs / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffMs < 86400000) { // Less than a day
        const hours = Math.floor(diffMs / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        // Format as date and time for older updates
        return lastUpdated.toLocaleString();
      }
    };
    
    return (
      <ScrollView style={styles.tabContent}>
        {/* PLT Token Card */}
        <View style={[styles.tokenCard, { backgroundColor: colors.card }]}>
          <View style={styles.tokenHeaderRow}>
            <Text style={[styles.tokenTitle, { color: colors.text }]}>Your PLT Tokens</Text>
            <TouchableOpacity 
              style={[styles.smallRefreshButton, { backgroundColor: colors.primary }]}
              onPress={handleTokenRefresh}
              disabled={tokenLoading}
            >
              {tokenLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.smallRefreshButtonText}>Refresh</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.tokenBalanceContainer}>
            <PLTTokenIcon size={40} showAmount={false} />
            <Text style={[styles.tokenBalance, { color: colors.text }]}>
              {balance?.toLocaleString() || '0'} <Text style={styles.tokenSymbol}>PLT</Text>
            </Text>
          </View>
          
          {tokenError && (
            <Text style={[styles.errorText, { color: colors.error, fontSize: Theme.typography.sizes.xs, marginVertical: Theme.spacing.xs }]}>
              {tokenError}
            </Text>
          )}
          
          <Text style={[styles.blockchainInfo, { color: colors.subtext }]}>
            Token on Nebula Gaming Hub (Chain ID: 0x235ddd0)
          </Text>
          
          <Text style={[styles.blockchainInfo, { color: colors.subtext, marginTop: 4 }]}>
            Contract: 0x48dDea582f933eA6FD8D1490a03B94382Dc7bc07
          </Text>
          
          <View style={styles.walletContainer}>
            <Text style={[styles.walletLabel, { color: colors.subtext }]}>Your wallet:</Text>
            <Text 
              style={[styles.walletAddress, { color: colors.primary }]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {walletAddress || '...'}
            </Text>
          </View>
          
          <Text style={[styles.lastUpdated, { color: colors.subtext }]}>
            Last updated: {getLastUpdatedText()}
          </Text>
        </View>
        
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Total $PLT Earned</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{balance?.toLocaleString() || '0'}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>NFTs Owned</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{nfts.length}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Games Played</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{GAME_HISTORY.length}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Win Rate</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {`${Math.round((GAME_HISTORY.filter(game => game.result === 'Won').length / GAME_HISTORY.length) * 100)}%`}
            </Text>
          </View>
        </View>
        
        <View style={styles.recentActivity}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          {GAME_HISTORY.slice(0, 3).map(game => (
            <View key={game.id} style={[styles.activityItem, { borderBottomColor: colors.divider }]}>
              <Text style={{ color: colors.text }}>{game.game}</Text>
              <View style={styles.activityDetails}>
                <Text style={{ color: colors.subtext }}>{game.date}</Text>
                <Text style={{ 
                  color: game.result === 'Won' ? colors.success : colors.error,
                  fontWeight: 'bold' 
                }}>
                  {game.result}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.primary }]}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderNFTsTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Theme.spacing.md }]}>
        Your NFT Collection
      </Text>
      <FlatList
        data={nfts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <NFTCard
            id={item.id}
            name={item.name}
            rarity={item.rarity}
            equipped={item.equipped}
            image={item.image}
            onEquip={handleEquipNFT}
            onSell={handleSellNFT}
          />
        )}
        contentContainerStyle={styles.nftList}
      />
      
      <TouchableOpacity 
        style={[styles.refreshButton, { backgroundColor: colors.primary, marginTop: Theme.spacing.lg }]}
        onPress={handleRefresh}
      >
        <Text style={styles.refreshButtonText}>Refresh NFTs</Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            User information not available
          </Text>
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors.primary }]} 
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            {user.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarInitial}>{user.name?.charAt(0) || '?'}</Text>
              </View>
            )}
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: colors.subtext }]}>{user.email}</Text>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'profile' && [styles.activeTab, { borderBottomColor: colors.primary }]]} 
              onPress={() => setActiveTab('profile')}
            >
              <Text
                style={[
                  styles.tabText, 
                  { color: activeTab === 'profile' ? colors.primary : colors.subtext }
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'stats' && [styles.activeTab, { borderBottomColor: colors.primary }]]} 
              onPress={() => setActiveTab('stats')}
            >
              <Text
                style={[
                  styles.tabText, 
                  { color: activeTab === 'stats' ? colors.primary : colors.subtext }
                ]}
              >
                Stats
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'nfts' && [styles.activeTab, { borderBottomColor: colors.primary }]]} 
              onPress={() => setActiveTab('nfts')}
            >
              <Text
                style={[
                  styles.tabText, 
                  { color: activeTab === 'nfts' ? colors.primary : colors.subtext }
                ]}
              >
                NFTs
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'nfts' && renderNFTsTab()}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.signOutButton, { backgroundColor: colors.primary }]} 
              onPress={handleSignOut}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.signOutButtonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Loading Screen Overlay */}
        <LoadingScreen 
          visible={isLoading} 
          message={loadingMessage}
          progress={loadingProgress}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  errorText: {
    fontSize: Theme.typography.sizes.md,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  header: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: Theme.typography.sizes.xxl,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  userName: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: Theme.typography.sizes.sm,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: Theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: '500',
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Theme.spacing.md,
  },
  statsCard: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  statLabel: {
    fontSize: Theme.typography.sizes.md,
  },
  statValue: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.lg,
    fontWeight: 'bold',
    marginVertical: Theme.spacing.sm,
  },
  recentActivity: {
    marginTop: Theme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
  },
  activityDetails: {
    alignItems: 'flex-end',
  },
  nftList: {
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
  },
  historyGameName: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  historyDate: {
    fontSize: Theme.typography.sizes.sm,
    marginTop: 4,
  },
  historyScore: {
    fontSize: Theme.typography.sizes.md,
    marginBottom: 4,
    textAlign: 'right',
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  actions: {
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  signOutButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.sm,
    minWidth: 150,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Theme.typography.sizes.md,
  },
  refreshButton: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.sm,
    minWidth: 150,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Theme.typography.sizes.md,
  },
  tokenCard: {
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  tokenHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  tokenTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  tokenBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Theme.spacing.md,
  },
  tokenBalance: {
    fontSize: Theme.typography.sizes.xxl,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.md,
  },
  tokenSymbol: {
    fontWeight: '500',
    opacity: 0.8,
  },
  blockchainInfo: {
    fontSize: Theme.typography.sizes.xs,
  },
  smallRefreshButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  smallRefreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: Theme.typography.sizes.xs,
  },
  walletContainer: {
    marginTop: Theme.spacing.md,
  },
  walletLabel: {
    fontSize: Theme.typography.sizes.sm,
  },
  walletAddress: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: Theme.typography.sizes.xs,
    marginTop: Theme.spacing.xs,
  },
}); 