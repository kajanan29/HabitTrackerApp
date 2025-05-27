import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
};

const CreateHabitScreen = () => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const handleSaveHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert('⚠️ Please enter a habit name.');
      return;
    }

    try {
      const existing = await AsyncStorage.getItem('habits');
      const habits = existing ? JSON.parse(existing) : [];

      const newHabit = {
        id: Date.now(),
        name: habitName.trim(),
        frequency: frequency,
        completedDates: [],
      };

      habits.push(newHabit);
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
      Alert.alert('✅ Habit saved successfully!');
      setHabitName('');
      setFrequency('Daily');

      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('❌ Error saving habit');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>🌱 Create a New Habit</Text>

          <TextInput
            placeholder="Enter habit name"
            value={habitName}
            onChangeText={setHabitName}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <View style={styles.pickerWrapper}>
            <Text style={styles.label}>Frequency</Text>
            <Picker
              selectedValue={frequency}
              onValueChange={(itemValue: 'Daily' | 'Weekly') => setFrequency(itemValue)}
              style={styles.picker}
              dropdownIconColor="#333"
            >
              <Picker.Item label="Daily" value="Daily" />
              <Picker.Item label="Weekly" value="Weekly" />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Save Habit" color="#4CAF50" onPress={handleSaveHabit} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f3',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  picker: {
    backgroundColor: Platform.OS === 'android' ? '#f9f9f9' : undefined,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 4,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default CreateHabitScreen;
