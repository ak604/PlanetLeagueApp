import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

/**
 * Planet League App UI Theme
 * 
 * This file contains reusable styles that can be applied across the app
 * to maintain a consistent look and feel.
 */

export const Theme = {
  // Typography
  typography: {
    // Font families will use the system font by default
    // but can be replaced with custom fonts
    fonts: {
      regular: undefined, // System font (can be replaced with custom font)
      medium: undefined,
      bold: undefined,
    },
    
    // Font sizes
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    
    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border Radius
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999, // For circular elements
  },
  
  // Shadows (for light mode)
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  
  // Animations
  animations: {
    short: 150,
    medium: 300,
    long: 500,
  },
  
  // Z-Index
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
    toast: 1000,
  },
};

// Create common styles that can be used across components
export const createThemedStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  
  return StyleSheet.create({
    // Containers
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
      padding: Theme.spacing.md,
    },
    centeredContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: Theme.spacing.md,
    },
    
    // Cards
    card: {
      backgroundColor: colors.card,
      borderRadius: Theme.borderRadius.md,
      padding: Theme.spacing.md,
      marginVertical: Theme.spacing.sm,
      ...Theme.shadows.md,
    },
    cardTitle: {
      fontSize: Theme.typography.sizes.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Theme.spacing.sm,
    },
    
    // Lists
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    listItemText: {
      fontSize: Theme.typography.sizes.md,
      color: colors.text,
    },
    
    // Texts
    heading: {
      fontSize: Theme.typography.sizes.xxl,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Theme.spacing.md,
    },
    subheading: {
      fontSize: Theme.typography.sizes.lg,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Theme.spacing.sm,
    },
    bodyText: {
      fontSize: Theme.typography.sizes.md,
      color: colors.text,
      lineHeight: Theme.typography.lineHeights.normal,
    },
    captionText: {
      fontSize: Theme.typography.sizes.sm,
      color: colors.subtext,
    },
    
    // Buttons
    primaryButton: {
      backgroundColor: colors.button,
      paddingVertical: Theme.spacing.sm,
      paddingHorizontal: Theme.spacing.md,
      borderRadius: Theme.borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: Theme.typography.sizes.md,
      fontWeight: 'bold',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: Theme.spacing.sm,
      paddingHorizontal: Theme.spacing.md,
      borderRadius: Theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    secondaryButtonText: {
      color: colors.primary,
      fontSize: Theme.typography.sizes.md,
      fontWeight: 'bold',
    },
    
    // Form elements
    input: {
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: Theme.borderRadius.sm,
      paddingHorizontal: Theme.spacing.md,
      paddingVertical: Theme.spacing.sm,
      color: colors.text,
      fontSize: Theme.typography.sizes.md,
      minHeight: 48,
    },
    inputLabel: {
      fontSize: Theme.typography.sizes.sm,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: Theme.spacing.xs,
    },
    
    // Dividers
    divider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: Theme.spacing.md,
    },
    
    // Icons
    icon: {
      color: colors.icon,
    },
    
    // Loading indicators
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    
    // Status indicators
    successText: {
      color: colors.success,
    },
    errorText: {
      color: colors.error,
    },
    
    // Badges
    badge: {
      backgroundColor: colors.primary,
      borderRadius: Theme.borderRadius.round,
      paddingHorizontal: Theme.spacing.sm,
      paddingVertical: Theme.spacing.xs / 2,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: Theme.typography.sizes.xs,
      fontWeight: 'bold',
    },
    
    // Tab navigation
    tabBar: {
      backgroundColor: colors.card,
      borderTopColor: colors.border,
      borderTopWidth: 1,
    },
    
    // Custom components for Planet League
    nftCard: {
      backgroundColor: colors.card,
      borderRadius: Theme.borderRadius.md,
      overflow: 'hidden',
      margin: Theme.spacing.sm,
      width: 160,
      ...Theme.shadows.md,
    },
    nftImage: {
      width: '100%',
      height: 160,
      resizeMode: 'cover',
    },
    nftInfo: {
      padding: Theme.spacing.sm,
    },
    nftName: {
      fontSize: Theme.typography.sizes.md,
      fontWeight: 'bold',
      color: colors.text,
    },
    nftRarity: {
      fontSize: Theme.typography.sizes.sm,
      color: colors.accent,
    },
    nftButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Theme.spacing.sm,
    },
    
    // Game history items
    gameHistoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    
    // Avatar
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarText: {
      fontSize: Theme.typography.sizes.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });
}; 