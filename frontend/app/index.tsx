import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // User is logged in, go to home
        router.replace('/(tabs)');
      } else {
        // User is not logged in, go to login
        router.replace('/login');
      }
    } catch (error) {
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0ea5e9' }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}