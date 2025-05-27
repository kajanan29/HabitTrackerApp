// components/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ percentage, color = '#4caf50' }: { percentage: number; color?: string }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
});

export default ProgressBar;
