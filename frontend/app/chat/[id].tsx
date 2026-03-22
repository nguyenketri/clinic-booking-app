import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { API_URL } from "../../constants/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Extract origin from API_URL (e.g. "http://10.0.2.2:5000")
const SOCKET_URL = API_URL.replace("/api", "");

export default function ChatRoomScreen() {
  const { id: receiverId, name: receiverName } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    initChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initChat = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem("userInfo");
      const token = await AsyncStorage.getItem("authToken");
      if (!userInfoStr || !token) return;

      const user = JSON.parse(userInfoStr);
      setCurrentUserId(user._id || user.id);

      // Fetch Chat History
      const res = await axios.get(`${API_URL}/chat/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);

      // Initialize Socket
      socketRef.current = io(SOCKET_URL);
      
      socketRef.current.on("connect", () => {
        socketRef.current.emit("join", user._id || user.id);
      });

      socketRef.current.on("receiveMessage", (newMessage: any) => {
        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      });

    } catch (error) {
      console.error("Chat init error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;

    const payload = {
      senderId: currentUserId,
      receiverId,
      message: inputText.trim(),
    };

    socketRef.current.emit("sendMessage", payload);
    setInputText("");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Stack.Screen options={{ title: typeof receiverName === 'string' ? receiverName : "Tin Nhắn" }} />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        style={styles.chatList}
        renderItem={({ item }) => {
          const isMine = item.senderId === currentUserId;
          return (
            <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
              <Text style={[styles.messageText, isMine && styles.myMessageText]}>
                {item.message}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  chatList: { flex: 1, padding: 10 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#0ea5e9",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  messageText: { fontSize: 16, color: "#334155" },
  myMessageText: { color: "#fff" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0ea5e9",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
