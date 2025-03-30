import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';

// Mock NFT data
const MOCK_NFTS = [
  { id: 'nft1', name: 'Cosmic Helmet', rarity: 'Rare', equipped: true, image: 'https://placehold.co/200x200/4285F4/FFFFFF?text=Helmet' },
  { id: 'nft2', name: 'Space Gloves', rarity: 'Uncommon', equipped: false, image: 'https://placehold.co/200x200/34A853/FFFFFF?text=Gloves' },
  { id: 'nft3', name: 'Nebula Shield', rarity: 'Epic', equipped: false, image: 'https://placehold.co/200x200/EA4335/FFFFFF?text=Shield' },
  { id: 'nft4', name: 'Star Boots', rarity: 'Common', equipped: false, image: 'https://placehold.co/200x200/FBBC05/FFFFFF?text=Boots' },
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
  const { user, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'nfts', or 'history'
  const [nfts, setNfts] = useState(MOCK_NFTS);

  const handleSignOut = () => {
    signOut();
  };

  const handleEquipNFT = (nftId) => {
    setNfts(nfts.map(nft => ({
      ...nft,
      equipped: nft.id === nftId
    })));
  };

  const handleSellNFT = (nftId) => {
    // In a real app, this would open a confirmation dialog and call an API
    console.log(`Selling NFT ${nftId}`);
  };

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      <ThemedView style={styles.statsCard}>
        <ThemedView style={styles.statItem}>
          <ThemedText type="subtitle">Total $PLT Earned</ThemedText>
          <ThemedText style={styles.statValue}>1,250</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedText type="subtitle">NFTs Owned</ThemedText>
          <ThemedText style={styles.statValue}>{nfts.length}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedText type="subtitle">Games Played</ThemedText>
          <ThemedText style={styles.statValue}>{GAME_HISTORY.length}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statItem}>
          <ThemedText type="subtitle">Win Rate</ThemedText>
          <ThemedText style={styles.statValue}>
            {`${Math.round((GAME_HISTORY.filter(game => game.result === 'Won').length / GAME_HISTORY.length) * 100)}%`}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.recentActivity}>
        <ThemedText type="body" bold>Recent Activity</ThemedText>
        {GAME_HISTORY.slice(0, 3).map(game => (
          <ThemedView key={game.id} style={styles.activityItem}>
            <ThemedText>{game.game}</ThemedText>
            <ThemedView style={styles.activityDetails}>
              <ThemedText>{game.date}</ThemedText>
              <ThemedText style={{ color: game.result === 'Won' ? '#34A853' : '#EA4335' }}>
                {game.result}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );

  const renderNFTsTab = () => (
    <View style={styles.tabContent}>
      <ThemedText type="body" bold style={styles.sectionTitle}>Your NFT Collection</ThemedText>
      <FlatList
        data={nfts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ThemedView style={styles.nftCard}>
            <Image source={{ uri: item.image }} style={styles.nftImage} />
            <ThemedText bold style={styles.nftName}>{item.name}</ThemedText>
            <ThemedText style={styles.nftRarity}>{item.rarity}</ThemedText>
            
            <ThemedView style={styles.nftActions}>
              <TouchableOpacity
                style={[styles.nftButton, item.equipped ? styles.equippedButton : {}]}
                onPress={() => handleEquipNFT(item.id)}
              >
                <ThemedText style={styles.nftButtonText}>
                  {item.equipped ? 'Equipped' : 'Equip'}
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.nftButton, styles.sellButton]}
                onPress={() => handleSellNFT(item.id)}
              >
                <ThemedText style={styles.nftButtonText}>Sell</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        )}
      />
    </View>
  );

  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      <ThemedText type="body" bold style={styles.sectionTitle}>Game History</ThemedText>
      <FlatList
        data={GAME_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.historyItem}>
            <ThemedView>
              <ThemedText bold>{item.game}</ThemedText>
              <ThemedText>{item.date}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.historyDetails}>
              <ThemedText>{item.score} pts</ThemedText>
              <ThemedText style={{ 
                color: item.result === 'Won' ? '#34A853' : '#EA4335',
                fontWeight: 'bold'
              }}>
                {item.result}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      />
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>User information not available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          {user.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.avatarInitial}>{user.name?.charAt(0) || '?'}</Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]} 
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nfts' && styles.activeTab]} 
            onPress={() => setActiveTab('nfts')}
          >
            <Text style={[styles.tabText, activeTab === 'nfts' && styles.activeTabText]}>NFTs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
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
            style={styles.signOutButton} 
            onPress={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  tabContentContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderAvatar: {
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#4285F4',
  },
  tabText: {
    fontWeight: '500',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    width: '100%',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDetails: {
    alignItems: 'flex-end',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  nftCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nftImage: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  nftName: {
    fontSize: 14,
  },
  nftRarity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  nftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nftButton: {
    backgroundColor: '#4285F4',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  equippedButton: {
    backgroundColor: '#34A853',
  },
  sellButton: {
    backgroundColor: '#EA4335',
  },
  nftButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  actions: {
    width: '100%',
    marginTop: 24,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 