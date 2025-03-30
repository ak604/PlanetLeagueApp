import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NFTCard from '../components/NFTCard';
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
  const { user, signOut, isLoading: authLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'nfts', or 'history'
  const [nfts, setNfts] = useState<NFT[]>(MOCK_NFTS);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading profile data...');

  // Function to simulate loading data with progress updates
  const loadUserData = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Connecting to server...');
    
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingProgress(0.2);
      setLoadingMessage('Fetching profile data...');
      
      // Simulate profile data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadingProgress(0.5);
      setLoadingMessage('Loading game history...');
      
      // Simulate game history loading
      await new Promise(resolve => setTimeout(resolve, 700));
      setLoadingProgress(0.7);
      setLoadingMessage('Loading NFT collection...');
      
      // Simulate NFT data loading
      await new Promise(resolve => setTimeout(resolve, 1200));
      setLoadingProgress(0.9);
      setLoadingMessage('Finalizing...');
      
      // Simulate finalizing
      await new Promise(resolve => setTimeout(resolve, 500));
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

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.subtext }]}>Total $PLT Earned</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>1,250</Text>
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

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Game History</Text>
      <FlatList
        data={GAME_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.historyItem, { borderBottomColor: colors.divider }]}>
            <View>
              <Text style={[styles.historyGameName, { color: colors.text }]}>{item.game}</Text>
              <Text style={[styles.historyDate, { color: colors.subtext }]}>{item.date}</Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={[styles.historyScore, { color: colors.text }]}>{item.score} pts</Text>
              <Text style={{ 
                color: item.result === 'Won' ? colors.success : colors.error,
                fontWeight: 'bold'
              }}>
                {item.result}
              </Text>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity 
        style={[styles.refreshButton, { backgroundColor: colors.primary, marginTop: Theme.spacing.lg, alignSelf: 'center' }]}
        onPress={handleRefresh}
      >
        <Text style={styles.refreshButtonText}>Refresh History</Text>
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
          <View style={[styles.tabs, { borderBottomColor: colors.divider }]}>
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
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'history' && [styles.activeTab, { borderBottomColor: colors.primary }]]} 
              onPress={() => setActiveTab('history')}
            >
              <Text
                style={[
                  styles.tabText, 
                  { color: activeTab === 'history' ? colors.primary : colors.subtext }
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'stats' && renderStatsTab()}
            {activeTab === 'nfts' && renderNFTsTab()}
            {activeTab === 'history' && renderHistoryTab()}
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
}); 