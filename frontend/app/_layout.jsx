import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setInitialRoute(token ? "(tabs)" : "login");
    } catch (error) {
      setInitialRoute("login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0ea5e9",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Đăng Nhập",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Đăng Ký",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          title: "Chọn Bác Sĩ",
        }}
      />
      <Stack.Screen
        name="booking"
        options={{
          title: "Đặt Lịch Khám",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Hồ Sơ Cá Nhân",
        }}
      />
      <Stack.Screen
        name="mybookings"
        options={{
          title: "Lịch Khám Của Tôi",
        }}
      />
    </Stack>
  );
}
