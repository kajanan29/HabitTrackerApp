import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HabitListScreen';
import ProgressScreen from '../screens/ProgressScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import LogoutScreen from '../screens/LogoutScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
<Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
  <Stack.Screen name="Progress" component={ProgressScreen} />
  <Stack.Screen name="Logout" component={LogoutScreen} />
</Stack.Navigator>

);

export default AppNavigator;
