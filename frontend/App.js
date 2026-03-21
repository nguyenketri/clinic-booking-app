import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";

// ⚠️ QUAN TRỌNG: THAY BẰNG IP MÁY TÍNH CỦA BẠN (Mở CMD gõ ipconfig để lấy IPv4)
// Ví dụ: 'http://192.168.1.15:5000/api'
const API_URL = "http://localhost:9999/api";

const Stack = createNativeStackNavigator();

// --- MÀN HÌNH 1: HOME (Danh sách bác sĩ) ---
function HomeScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể kết nối tới Server. Nhớ kiểm tra lại IP nhé!",
      );
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Chọn Bác sĩ / Phòng khám</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Booking", { doctor: item })}
          >
            <Text style={styles.docName}>{item.name}</Text>
            <Text>Chuyên khoa: {item.specialty}</Text>
            <Text>Giá khám: {item.price} VND</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// --- MÀN HÌNH 2: BOOKING (Đặt lịch) ---
function BookingScreen({ route, navigation }) {
  const { doctor } = route.params;
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const handleBooking = async () => {
    if (!patientName || !phone || !date) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin!");
      return;
    }
    try {
      await axios.post(`${API_URL}/bookings`, {
        patientName,
        phone,
        date,
        doctorId: doctor._id,
      });
      Alert.alert("Thành công", "Đã đặt lịch hẹn thành công!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Đặt lịch thất bại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Đặt lịch khám với {doctor.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên bệnh nhân"
        onChangeText={setPatientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày khám (VD: 25/03/2026)"
        onChangeText={setDate}
      />

      <TouchableOpacity style={styles.btn} onPress={handleBooking}>
        <Text style={styles.btnText}>Xác nhận đặt lịch</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- APP NAVIGATION ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Clinic Booking" }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: "Chi tiết đặt lịch" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  docName: { fontSize: 18, fontWeight: "bold", color: "#2b6cb0" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    backgroundColor: "#2b6cb0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
