import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router'; // Import Link for navigation

// Define Game type
interface Game {
  id: string;
  name: string;
  description: string;
  icon: string; // Placeholder for icon name or URL
  gameUrl: string; // URL for the HTML5 game
}

// Placeholder game data with sample game URLs
// *** IMPORTANT: Replace these URLs with actual HTML5 game URLs ***
const games: Game[] = [
  {
    id: '1',
    name: 'Puzzle Mania',
    description: 'Solve puzzles, earn $PLT',
    icon: 'puzzlepiece.fill', // Example icon name
    gameUrl: 'https://puzzles.example.com',
  },
  {
    id: '2',
    name: 'Trivia Time',
    description: 'Answer questions, earn $PLT',
    icon: 'questionmark.diamond.fill', // Example icon name
    gameUrl: 'https://trivia.example.com',
  },
  {
    id: '3',
    name: '2048', // A common simple HTML5 game
    description: 'Combine tiles, earn $PLT',
    icon: 'squareshape.split.2x2', // Example icon name
    gameUrl: 'https://play2048.co/', // Example public 2048 game
  },
  // Add more games as needed
];

const numColumns = 2; // Adjust number of columns for the grid
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns - 30; // Calculate item width based on columns and padding

const GameHubScreen = () => {

  const renderGameItem = ({ item }: { item: Game }) => (
    // Link to a generic game player screen, passing the URL and name
    <Link 
      href={{
        pathname: "/gameplayer", // Route for the WebView screen (needs to be created)
        params: { gameUrl: item.gameUrl, gameName: item.name } 
      }}
      asChild
    > 
      <TouchableOpacity style={styles.gameItemContainer}>
        {/* TODO: Use the actual item.icon */}
        <View style={styles.gameIconPlaceholder}>
          <Text style={styles.gameIconText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.gameTitle}>{item.name}</Text>
        <Text style={styles.gameDescription}>{item.description}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Game Hub</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  gridContainer: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20, // Add space between rows
  },
  gameItemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: itemWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
    minHeight: 150, // Ensure items have a minimum height
  },
  gameIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gameIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#444',
  },
  gameDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default GameHubScreen; 