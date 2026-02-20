import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from './src/theme/theme';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

// Screens
import RequestScreen from '@/screens/RequestScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';

type RootTabParamList = {
  Request: { loadRequest?: { method: string; url: string; headers?: Record<string, string>; body?: string } };
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerShadowVisible: false,
          headerTintColor: COLORS.text,
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.border,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
        }}
      >
        <Tab.Screen
          name="Request"
          component={RequestScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="send" size={18} color={COLORS.primary} />

          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="history" size={18} color={COLORS.primary} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Feather name="settings" size={18} color={COLORS.primary} />
            ,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
