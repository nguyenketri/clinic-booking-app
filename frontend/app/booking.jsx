import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import bookingService from "../services/bookingService";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  const validateForm = () => {
    if (!patientName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên bệnh nhân");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return false;
    }

    if (!/^(0|84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ""))) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
      return false;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return false;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (selectedDate < tomorrow) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày khám từ ngày mai trở đi");
      return false;
    }

    return true;
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const doctorId = Array.isArray(params.doctorId)
        ? params.doctorId[0]
        : params.doctorId;
      const doctorName = Array.isArray(params.doctorName)
        ? params.doctorName[0]
        : params.doctorName;

      if (!doctorId) {
        Alert.alert("Lỗi", "Không tìm thấy thông tin bác sĩ");
        setIsSubmitting(false);
        return;
      }

      // Format date and time
      const dateString = selectedDate.toISOString().split("T")[0];
      const dateTimeString = `${dateString}T${selectedTime}:00`;

      const bookingData = {
        patientName,
        phone,
        email: email || undefined,
        date: new Date(dateTimeString),
        time: selectedTime,
        notes: notes || undefined,
        doctorId,
      };

      console.log("Booking data:", bookingData);

      const result = await bookingService.createBooking(bookingData);

      Alert.alert("Thành công", `Đặt lịch với ${doctorName} thành công!`, [
        {
          text: "Tiếp tục thanh toán",
          onPress: () => router.push({
            pathname: "/payment",
            params: { 
              bookingId: result._id,
              amount: result.totalPrice
            }
          }),
        },
        {
          text: "Để sau",
          onPress: () => router.push("/(tabs)/mybookings"),
        },
      ]);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Booking error:", error);
      setIsSubmitting(false);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Không thể đặt lịch. Vui lòng thử lại.";
      Alert.alert("Lỗi", errorMsg);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.infoCard}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{params.doctorName}</Text>
          <Text style={styles.specialty}>{params.doctorSpecialty}</Text>
        </View>
        <Text style={styles.price}>
          {Number(params.doctorPrice).toLocaleString("vi-VN")} VNĐ
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Thông tin bệnh nhân</Text>

        <Text style={styles.label}>Tên bệnh nhân *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên đầy đủ"
          placeholderTextColor="#cbd5e1"
          value={patientName}
          onChangeText={setPatientName}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Số điện thoại *</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 0912345678"
          placeholderTextColor="#cbd5e1"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="(Tùy chọn)"
          placeholderTextColor="#cbd5e1"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!isSubmitting}
        />

        <Text style={styles.formTitle}>Lịch khám</Text>

        <Text style={styles.label}>Ngày khám *</Text>
        <TouchableOpacity
          style={styles.dateTimeBox}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#0ea5e9" />
          <Text style={styles.dateTimeText}>
            {selectedDate.toLocaleDateString("vi-VN")}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Giờ khám *</Text>
        <TouchableOpacity
          style={styles.dateTimeBox}
          onPress={() => setShowTimePicker(true)}
        >
          <MaterialIcons name="access-time" size={20} color="#0ea5e9" />
          <Text style={styles.dateTimeText}>{selectedTime}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Ghi chú (Tùy chọn)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."
          placeholderTextColor="#cbd5e1"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          editable={!isSubmitting}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.btn, isSubmitting && styles.disabledBtn]}
          onPress={handleBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
              <Text style={styles.btnText}>Xác nhận Đặt lịch</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        supportedOrientations={["portrait"]}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerContent}>
             <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Chọn ngày khám</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <MaterialIcons name="close" size={24} color="#0369a1" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i + 1); // From tomorrow
                return d;
              })}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeSlotRow,
                    { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" }
                  ]}
                  onPress={() => {
                    setSelectedDate(item);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#1e293b", textAlign: "center", width: "100%" }}>
                    {item.toLocaleDateString("vi-VN")}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        supportedOrientations={["portrait"]}
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerContent}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>Chọn giờ khám</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <MaterialIcons name="close" size={24} color="#0369a1" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={timeSlots}
              keyExtractor={(item) => item}
              numColumns={4}
              columnWrapperStyle={styles.timeSlotRow}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    selectedTime === item && styles.timeSlotActive,
                  ]}
                  onPress={() => {
                    setSelectedTime(item);
                    setShowTimePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === item && styles.timeSlotTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />

            <TouchableOpacity
              style={styles.timePickerBtn}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.timePickerBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  infoCard: {
    backgroundColor: "#e0f2fe",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  doctorInfo: {
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 13,
    color: "#0369a1",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0369a1",
  },
  form: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0369a1",
    marginBottom: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  textArea: {
    paddingTop: 10,
  },
  dateTimeBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 14,
    color: "#1e293b",
    marginLeft: 8,
    fontWeight: "500",
  },
  btn: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timePickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    pointerEvents: "auto",
  },
  timePickerContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    pointerEvents: "auto",
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0369a1",
  },
  timeSlotRow: {
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timeSlot: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
  },
  timeSlotActive: {
    backgroundColor: "#0ea5e9",
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0369a1",
  },
  timeSlotTextActive: {
    color: "#fff",
  },
  timePickerBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  timePickerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
