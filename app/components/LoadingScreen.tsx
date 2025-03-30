import React from 'react';
import { View, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { LoadingBar } from './LoadingBar';
import { Theme } from '@/constants/Theme';

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
  progress?: number;
  showSpinner?: boolean;
}

export const LoadingScreen = ({
  visible,
  message = 'Loading data...',
  progress,
  showSpinner = true
}: LoadingScreenProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor: `${colors.background}CC` }]}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          {showSpinner && (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.spinner}
            />
          )}
          
          <LoadingBar 
            message={message} 
            progress={progress} 
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    ...Theme.shadows.lg,
  },
  spinner: {
    marginBottom: Theme.spacing.md,
  }
}); 