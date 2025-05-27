import AsyncStorage from '@react-native-async-storage/async-storage';

export const getHabits = async () => {
  const data = await AsyncStorage.getItem('habits');
  return data ? JSON.parse(data) : [];
};
