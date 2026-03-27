import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import bookingService from "../services/bookingService";

export default function PaymentScreen() {
  const router = useRouter();
  const { bookingId, amount } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState<any>(null);

  useEffect(() => {
    fetchBankInfo();
  }, []);

  const fetchBankInfo = async () => {
    try {
      if (!bookingId || !amount) {
        Alert.alert("Lỗi", "Thiếu thông tin thanh toán");
        router.back();
        return;
      }

      const res = await bookingService.createBankTransfer(
        bookingId as string,
        Number(amount)
      );
      setBankInfo(res.bankInfo);
    } catch (error) {
      console.error("Fetch bank info error:", error);
      Alert.alert("Lỗi", "Không thể lấy thông tin chuyển khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Chuyển khoản thanh toán lịch khám:
Ngân hàng: ${bankInfo.bankName}
STK: ${bankInfo.accountNumber}
Chủ TK: ${bankInfo.accountName}
Số tiền: ${Number(bankInfo.amount).toLocaleString("vi-VN")} VNĐ
Nội dung: ${bankInfo.content}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0ea5e9" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Thanh Toán Chuyển Khoản" }} />
      
      <View style={styles.header}>
        <MaterialIcons name="account-balance" size={48} color="#0ea5e9" />
        <Text style={styles.title}>Thông Tin Chuyển Khoản</Text>
        <Text style={styles.subtitle}>Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống xác nhận tự động</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngân hàng</Text>
          <Text style={styles.value}>{bankInfo?.bankName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số tài khoản</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.value, styles.copyText]}>{bankInfo?.accountNumber}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Chủ tài khoản</Text>
          <Text style={styles.value}>{bankInfo?.accountName}</Text>
        </View>
        <View style={[styles.infoRow, styles.amountRow]}>
          <Text style={styles.label}>Số tiền</Text>
          <Text style={styles.amountValue}>
            {Number(bankInfo?.amount).toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.label}>Nội dung chuyển khoản</Text>
          <View style={styles.contentContainer}>
             <Text style={styles.contentValue}>{bankInfo?.content}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
           <MaterialIcons name="share" size={20} color="#0ea5e9" />
           <Text style={styles.shareBtnText}>Chia sẻ thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.doneBtn} 
          onPress={() => {
            Alert.alert("Thông báo", "Cảm ơn bạn! Chúng tôi sẽ kiểm tra và xác nhận lịch khám của bạn sớm nhất.");
            router.replace("/(tabs)/mybookings");
          }}
        >
          <Text style={styles.doneBtnText}>Tôi đã chuyển khoản</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.backBtnText}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: { alignItems: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1e293b", marginTop: 12 },
  subtitle: { fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 8 },
  card: { backgroundColor: "#fff", margin: 16, padding: 20, borderRadius: 16, elevation: 2 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, alignItems: "center" },
  label: { fontSize: 14, color: "#64748b" },
  value: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  copyText: { color: "#0ea5e9" },
  amountRow: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 16 },
  amountValue: { fontSize: 20, fontWeight: "bold", color: "#f43f5e" },
  contentRow: { marginTop: 8 },
  contentContainer: { 
    backgroundColor: "#f0f9ff", 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: "#bae6fd",
    marginTop: 8,
    alignItems: "center"
  },
  contentValue: { fontSize: 18, fontWeight: "bold", color: "#0369a1", letterSpacing: 1 },
  actions: { padding: 16, gap: 12 },
  shareBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 12, 
    gap: 8,
    borderWidth: 1,
    borderColor: "#0ea5e9",
    borderRadius: 8
  },
  shareBtnText: { color: "#0ea5e9", fontWeight: "600" },
  doneBtn: { 
    backgroundColor: "#0ea5e9", 
    padding: 16, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backBtn: { padding: 12, alignItems: "center" },
  backBtnText: { color: "#64748b" },
});
