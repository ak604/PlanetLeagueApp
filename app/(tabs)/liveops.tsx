import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data for daily quests
const DAILY_QUESTS = [
  { id: 'q1', title: 'Play 3 games', reward: 25, progress: 1, total: 3 },
  { id: 'q2', title: 'Win a game', reward: 25, progress: 0, total: 1 },
  { id: 'q3', title: 'Complete a tutorial', reward: 25, progress: 1, total: 1, completed: true },
  { id: 'q4', title: 'Visit the Game Hub', reward: 10, progress: 0, total: 1 },
  { id: 'q5', title: 'Play with a friend', reward: 50, progress: 0, total: 1 },
];

// Mock data for tournament leaderboard
const TOURNAMENT_LEADERBOARD = [
  { id: 'p1', name: 'GamerPro99', score: 1250, rank: 1, reward: 300 },
  { id: 'p2', name: 'CryptoGamer', score: 1100, rank: 2, reward: 200 },
  { id: 'p3', name: 'BlockchainMaster', score: 980, rank: 3, reward: 150 },
  { id: 'p4', name: 'Player4545', score: 870, rank: 4, reward: 100 },
  { id: 'p5', name: 'TokenCollector', score: 810, rank: 5, reward: 75 },
  { id: 'p6', name: 'Web3Gamer', score: 780, rank: 6, reward: 50 },
  { id: 'p7', name: 'CryptoKitty', score: 720, rank: 7, reward: 50 },
  { id: 'p8', name: 'GameWizard', score: 690, rank: 8, reward: 25 },
  { id: 'p9', name: 'NFTHunter', score: 650, rank: 9, reward: 25 },
  { id: 'p10', name: 'P2EPlayer', score: 620, rank: 10, reward: 25 },
];

export default function LiveOpsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('quests'); // 'quests' or 'tournaments'
  const [userRank, setUserRank] = useState(15); // Mock user's rank
  const [userScore, setUserScore] = useState(450); // Mock user's score
  
  const handleClaimReward = (questId: string) => {
    // In a real app, this would call an API to claim the reward
    console.log(`Claiming reward for quest ${questId}`);
    // You would update the quest state here
  };
  
  const handleJoinTournament = () => {
    // In a real app, this would call an API to join the tournament
    console.log('Joining tournament');
    // You would update the user's tournament status here
  };
  
  const renderDailyQuests = () => (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Daily Quests</ThemedText>
      <ThemedText>Complete quests to earn $PLT tokens</ThemedText>
      
      {DAILY_QUESTS.map(quest => (
        <ThemedView key={quest.id} style={styles.questItem}>
          <View style={styles.questInfo}>
            <ThemedText type="body" bold>{quest.title}</ThemedText>
            <ThemedText>{quest.progress} / {quest.total}</ThemedText>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(quest.progress / quest.total) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.questReward}>
            <ThemedText bold>{quest.reward} $PLT</ThemedText>
            {quest.completed ? (
              <ThemedText style={styles.completedText}>Claimed</ThemedText>
            ) : (
              <TouchableOpacity 
                style={[
                  styles.claimButton,
                  quest.progress < quest.total && styles.disabledButton
                ]}
                disabled={quest.progress < quest.total}
                onPress={() => handleClaimReward(quest.id)}
              >
                <ThemedText style={styles.buttonText}>
                  {quest.progress < quest.total ? 'Incomplete' : 'Claim'}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </ThemedView>
      ))}
    </ThemedView>
  );
  
  const renderTournaments = () => (
    <ThemedView style={styles.section}>
      <ThemedView style={styles.tournamentHeader}>
        <View>
          <ThemedText type="subtitle">Weekly Tournament</ThemedText>
          <ThemedText>Ends in 2d 14h 23m</ThemedText>
        </View>
        
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinTournament}>
          <ThemedText style={styles.buttonText}>Join for 10 $PLT</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.prizePool}>
        <ThemedText type="body" bold>Prize Pool: 1,000 $PLT</ThemedText>
        <ThemedText>Top 10 players share the rewards</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.yourRank}>
        <ThemedText type="body" bold>Your Position</ThemedText>
        <ThemedText>Rank #{userRank} • Score: {userScore}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.leaderboard}>
        <View style={styles.leaderboardHeader}>
          <ThemedText style={styles.rankColumn} bold>Rank</ThemedText>
          <ThemedText style={styles.nameColumn} bold>Player</ThemedText>
          <ThemedText style={styles.scoreColumn} bold>Score</ThemedText>
          <ThemedText style={styles.rewardColumn} bold>Reward</ThemedText>
        </View>
        
        {TOURNAMENT_LEADERBOARD.map(player => (
          <View key={player.id} style={styles.leaderboardRow}>
            <ThemedText style={styles.rankColumn}>{player.rank}</ThemedText>
            <ThemedText style={styles.nameColumn} numberOfLines={1} ellipsizeMode="tail">{player.name}</ThemedText>
            <ThemedText style={styles.scoreColumn}>{player.score}</ThemedText>
            <ThemedText style={styles.rewardColumn}>{player.reward} $PLT</ThemedText>
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">LiveOps Events</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'quests' && styles.activeTab]} 
          onPress={() => setActiveTab('quests')}
        >
          <ThemedText 
            style={[styles.tabText, activeTab === 'quests' && styles.activeTabText]} 
            bold={activeTab === 'quests'}
          >
            Daily Quests
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]} 
          onPress={() => setActiveTab('tournaments')}
        >
          <ThemedText 
            style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]} 
            bold={activeTab === 'tournaments'}
          >
            Weekly Tournament
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ScrollView style={styles.content}>
        {activeTab === 'quests' ? renderDailyQuests() : renderTournaments()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4285F4',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: '#4285F4',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  questItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  questInfo: {
    flex: 1,
    marginRight: 12,
  },
  questReward: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eaeaea',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completedText: {
    color: '#4CAF50',
    marginTop: 8,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  prizePool: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  yourRank: {
    backgroundColor: '#FFF7E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  leaderboard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginBottom: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankColumn: {
    width: '15%',
    textAlign: 'center',
    fontSize: 14,
  },
  nameColumn: {
    width: '40%',
    paddingLeft: 8,
    fontSize: 14,
  },
  scoreColumn: {
    width: '20%',
    textAlign: 'right',
    fontSize: 14,
  },
  rewardColumn: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 8,
    fontSize: 14,
  },
}); 