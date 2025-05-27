import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../components/ProgressBar';

type Habit = {
  id: number;
  name: string;
  frequency: 'Daily' | 'Weekly';
  completedDates: string[];
};

const ProgressScreen = () => {
  const [completionRate, setCompletionRate] = useState(0);
  const [weeklyCompletion, setWeeklyCompletion] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    calculateProgress();
    calculateWeeklyProgress();
  }, []);

  const calculateProgress = async () => {
    try {
      const data = await AsyncStorage.getItem('habits');
      const habits: Habit[] = data ? JSON.parse(data) : [];

      if (habits.length === 0) {
        setCompletionRate(0);
        return;
      }

      const completedCount = habits.filter((habit) =>
        habit.completedDates.includes(today)
      ).length;

      const percentage = Math.round((completedCount / habits.length) * 100);
      setCompletionRate(percentage);
    } catch {
      Alert.alert('Failed to load today\'s progress');
    }
  };

  const calculateWeeklyProgress = async () => {
    try {
      const data = await AsyncStorage.getItem('habits');
      const habits: Habit[] = data ? JSON.parse(data) : [];

      if (habits.length === 0) {
        setWeeklyCompletion(0);
        return;
      }

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      });

      const completedCount = habits.filter((habit) =>
        weekDates.some(date => habit.completedDates.includes(date))
      ).length;

      const percentage = Math.round((completedCount / habits.length) * 100);
      setWeeklyCompletion(percentage);
    } catch {
      Alert.alert('Failed to load weekly progress');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📅 Today's Progress</Text>
        <Text style={styles.percentage}>{completionRate}% of habits completed today</Text>
        <ProgressBar percentage={completionRate} color="#4caf50" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📈 Weekly Progress</Text>
        <Text style={styles.percentage}>{weeklyCompletion}% of habits completed this week</Text>
        <ProgressBar percentage={weeklyCompletion} color="#2196f3" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  percentage: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
});

export default ProgressScreen;
