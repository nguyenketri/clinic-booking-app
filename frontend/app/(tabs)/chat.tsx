import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import doctorService from "../../services/doctorService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatListScreen() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      const user = userInfoStr ? JSON.parse(userInfoStr) : null;
      
      // Simple implementation: Just fetch doctors to chat with
      // (For 8-point requirement 'Users can chat with each other')
      const doctorsList = await doctorService.getDoctors();
      setContacts(doctorsList);
    } catch (error) {
      console.error("Error fetching contacts", error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (receiver) => {
    // Navigate to chat room with receiver's user ID (since doctor object has userId field)
    const receiverId = receiver.userId._id || receiver.userId;
    router.push({
      pathname: "/chat/[id]",
      params: { id: receiverId, name: receiver.name }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} onPress={() => openChat(item)}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactSub}>{item.specialty}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  contactItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#0ea5e9",
    justifyContent: "center", alignItems: "center",
    marginRight: 15,
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  contactName: { fontSize: 16, fontWeight: "bold", color: "#334155" },
  contactSub: { fontSize: 14, color: "#64748b", marginTop: 4 },
});
