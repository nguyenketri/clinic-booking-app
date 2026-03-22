import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import bookingService, { Booking } from '../services/bookingService';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Không thể tải danh sách lịch khám';
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Hủy lịch khám',
      'Bạn có chắc muốn hủy lịch khám này?',
      [
        { text: 'Không', onPress: () => {} },
        {
          text: 'Có',
          onPress: async () => {
            try {
              await bookingService.cancelBooking(bookingId);
              Alert.alert('Thành công', 'Hủy lịch khám thành công!');
              loadBookings();
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Hủy lịch thất bại';
              Alert.alert('Lỗi', errorMsg);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handlePayment = async (bookingId: string) => {
    try {
      await bookingService.mockPayment(bookingId, true);
      Alert.alert('Thành công', 'Thanh toán thành công! Lịch khám đã được xác nhận.');
      loadBookings();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Thanh toán thất bại';
      Alert.alert('Lỗi', errorMsg);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f97316';
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#0369a1';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedBooking(item);
        setShowModal(true);
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.doctorName}>
          {item.doctorId?.name || 'N/A'}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Chuyên khoa:</Text>
          <Text style={styles.value}>
            {item.doctorId?.specialty || 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Chuẩn bị khám:</Text>
          <Text style={styles.value}>
            {new Date(item.date).toLocaleDateString('vi-VN')} {item.time}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Bệnh nhân:</Text>
          <Text style={styles.value}>{item.patientName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Giá khám:</Text>
          <Text style={styles.value}>
            {Number(item.totalPrice).toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {item.status === 'pending' && item.paymentStatus === 'pending' && (
          <TouchableOpacity
            style={styles.payBtn}
            onPress={() => handlePayment(item._id)}
          >
            <Text style={styles.payBtnText}>Thanh toán</Text>
          </TouchableOpacity>
        )}
        {item.status === 'pending' && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancelBooking(item._id)}
          >
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có lịch khám nào</Text>
          <Text style={styles.emptySubtext}>
            Hãy đặt lịch khám với bác sĩ ngay
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowModal(false)}
          >
            <Text style={styles.closeBtnText}>Đóng</Text>
          </TouchableOpacity>

          {selectedBooking && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chi tiết lịch khám</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bác sĩ:</Text>
                <Text style={styles.detailValue}>
                  {selectedBooking.doctorId?.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Chuyên khoa:</Text>
                <Text style={styles.detailValue}>
                  {selectedBooking.doctorId?.specialty}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngày khám:</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedBooking.date).toLocaleDateString('vi-VN')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Giờ khám:</Text>
                <Text style={styles.detailValue}>{selectedBooking.time}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bệnh nhân:</Text>
                <Text style={styles.detailValue}>{selectedBooking.patientName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Số điện thoại:</Text>
                <Text style={styles.detailValue}>{selectedBooking.phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Giá khám:</Text>
                <Text style={[styles.detailValue, styles.priceValue]}>
                  {Number(selectedBooking.totalPrice).toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Trạng thái:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(
                        selectedBooking.status
                      ),
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(selectedBooking.status)}
                  </Text>
                </View>
              </View>

              {selectedBooking.notes && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ghi chú:</Text>
                  <Text style={styles.detailValue}>{selectedBooking.notes}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  value: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  payBtn: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingTop: 16,
  },
  closeBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  priceValue: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
