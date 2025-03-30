import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';

type NFTRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

type NFTCardProps = {
  id: string;
  name: string;
  rarity: NFTRarity;
  equipped: boolean;
  image: any; // Image source
  onEquip: (id: string) => void;
  onSell: (id: string) => void;
};

export default function NFTCard({ id, name, rarity, equipped, image, onEquip, onSell }: NFTCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Get the color based on rarity
  const getRarityColor = (rarity: NFTRarity) => {
    switch (rarity) {
      case 'Common':
        return '#9AA0A6'; // Gray
      case 'Uncommon':
        return '#34A853'; // Green
      case 'Rare':
        return '#4285F4'; // Blue
      case 'Epic':
        return '#9C27B0'; // Purple
      case 'Legendary':
        return '#FBBC05'; // Gold
      default:
        return '#9AA0A6';
    }
  };
  
  // Get the border style based on rarity
  const getRarityBorder = (rarity: NFTRarity) => {
    const color = getRarityColor(rarity);
    
    return {
      borderWidth: 2,
      borderColor: color,
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: rarity === 'Legendary' ? 0.7 : 0.3,
      shadowRadius: 5,
      elevation: rarity === 'Legendary' ? 5 : 3,
    };
  };
  
  return (
    <View style={[
      styles.card,
      getRarityBorder(rarity),
      { backgroundColor: colors.card }
    ]}>
      <Image source={image} style={styles.image} />
      
      {equipped && (
        <View style={styles.equippedBadge}>
          <Text style={styles.equippedText}>EQUIPPED</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.rarity, { color: getRarityColor(rarity) }]}>{rarity}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            equipped ? styles.equippedButton : styles.equipButton,
            { borderColor: colors.primary }
          ]}
          onPress={() => onEquip(id)}
          disabled={equipped}
        >
          <Text style={[
            styles.buttonText,
            { color: equipped ? colors.background : colors.primary }
          ]}>
            {equipped ? 'Equipped' : 'Equip'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.sellButton,
            { borderColor: colors.error }
          ]}
          onPress={() => onSell(id)}
        >
          <Text style={[styles.buttonText, { color: colors.error }]}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    margin: Theme.spacing.sm,
    ...Theme.shadows.md,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  equippedBadge: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: 'rgba(52, 168, 83, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: Theme.borderRadius.sm,
    borderBottomLeftRadius: Theme.borderRadius.sm,
  },
  equippedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: Theme.spacing.sm,
  },
  name: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rarity: {
    fontSize: Theme.typography.sizes.sm,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: Theme.spacing.sm,
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  equipButton: {
    backgroundColor: 'transparent',
  },
  equippedButton: {
    backgroundColor: '#34A853',
    borderColor: '#34A853',
  },
  sellButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 