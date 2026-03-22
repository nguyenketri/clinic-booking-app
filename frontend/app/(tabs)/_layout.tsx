import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0ea5e9",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "#cbd5e1",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e2e8f0",
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang Chủ",
          tabBarLabel: "Trang Chủ",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
          headerTitle: "Chọn Bác Sĩ",
        }}
      />
      <Tabs.Screen
        name="mybookings"
        options={{
          title: "Lịch Khám",
          tabBarLabel: "Lịch Khám",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
          headerTitle: "Lịch Khám Của Tôi",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ Sơ",
          tabBarLabel: "Hồ Sơ",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
          headerTitle: "Hồ Sơ Cá Nhân",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Tin Nhắn",
          tabBarLabel: "Tin Nhắn",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat" size={24} color={color} />
          ),
          headerTitle: "Tin Nhắn",
        }}
      />
    </Tabs>
  );
}
