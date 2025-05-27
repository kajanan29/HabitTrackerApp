import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  useFocusEffect,
  NavigationProp,
} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

type Habit = {
  id: number;
  name: string;
  frequency: 'Daily' | 'Weekly';
  completedDates: string[];
};

type RootStackParamList = {
  HabitList: undefined;
  CreateHabit: undefined;
  Login: undefined;
  Progress: undefined;
};

const HabitListScreen = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Daily' | 'Weekly'>('All');
  const today = new Date().toISOString().split('T')[0];
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    try {
      const data = await AsyncStorage.getItem('habits');
      const parsed: Habit[] = data ? JSON.parse(data) : [];
      setHabits(parsed);
    } catch {
      Alert.alert('Failed to load habits');
    }
  };

  const saveHabits = async (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const markAsCompleted = async (id: number) => {
    const updated = habits.map((h) =>
      h.id === id && !h.completedDates.includes(today)
        ? { ...h, completedDates: [...h.completedDates, today] }
        : h
    );
    await saveHabits(updated);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
  };

  const deleteHabit = (id: number) => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = habits.filter((h) => h.id !== id);
          await saveHabits(updated);
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch {
      Alert.alert('Logout failed');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: handleLogout, style: 'destructive' },
    ]);
  };

  const renderHabit = ({ item }: { item: Habit }) => {
    const isCompleted = item.completedDates.includes(today);
    return (
      <View style={styles.card}>
        <Text style={styles.habitName}>{item.name}</Text>
        <Text>Status: {isCompleted ? '✅ Completed' : '❌ Not Completed'}</Text>

        {!isCompleted && (
          <Button
            title="Mark as Completed"
            onPress={() => markAsCompleted(item.id)}
            color="#388e3c"
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Button
            title="Delete"
            color="#d32f2f"
            onPress={() => deleteHabit(item.id)}
          />
        </View>
      </View>
    );
  };

  const filteredHabits =
    filter === 'All' ? habits : habits.filter((h) => h.frequency === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Your Habits</Text>

      {/* Filter Toggle */}
      <View style={styles.filterRow}>
        {['All', 'Daily', 'Weekly'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type as 'All' | 'Daily' | 'Weekly')}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add + Progress */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Add Habit"
            onPress={() => navigation.navigate('CreateHabit')}
            color="#1e88e5"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="View Progress"
            onPress={() => navigation.navigate('Progress')}
            color="#43a047"
          />
        </View>
      </View>

      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHabit}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={confirmLogout} color="#ff4444" />
      </View>

      {/* Animation Modal */}
      <Modal visible={showAnimation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animatable.Text
            animation="bounceIn"
            duration={1500}
            style={styles.congratsText}
            onAnimationEnd={() => {
              requestAnimationFrame(() => setShowAnimation(false));
            }}
          >
            🎉 Completed!
          </Animatable.Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#2196f3',
  },
  filterText: {
    color: '#333',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },
});

export default HabitListScreen;
