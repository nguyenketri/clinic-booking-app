import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ListRenderItem } from "react-native";

type BookingStatus = "pending" | "confirmed" | "cancelled";

type Booking = {
  id: string;
  date: string;
  guests: number;
  status: BookingStatus;
};

export default function MyBooking() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: "1", date: "2026-03-10", guests: 2, status: "pending" },
    { id: "2", date: "2026-03-15", guests: 4, status: "confirmed" },
  ]);

  const handleCancel = (id: Booking["id"]) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "cancelled" } : item
      )
    );
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "confirmed":
        return "#27ae60";
      case "cancelled":
        return "#e74c3c";
    }
  };

  const renderItem: ListRenderItem<Booking> = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.date}>📅 {item.date}</Text>
        <Text style={styles.guests}>👥 {item.guests} guests</Text>

        <Text
          style={[
            styles.status,
            { color: getStatusColor(item.status) },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.cancelBtn,
          item.status === "cancelled" && styles.disabledBtn,
        ]}
        disabled={item.status === "cancelled"}
        onPress={() => handleCancel(item.id)}
      >
        <Text style={styles.cancelText}>
          {item.status === "cancelled" ? "Cancelled" : "Cancel"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Bookings</Text>

        <View style={{ width: 50 }} />
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings yet 😢</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  back: {
    fontSize: 16,
    color: "#3498db",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },

  date: {
    fontSize: 16,
    fontWeight: "600",
  },

  guests: {
    marginTop: 4,
    color: "#555",
  },

  status: {
    marginTop: 8,
    fontWeight: "bold",
  },

  cancelBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  disabledBtn: {
    backgroundColor: "#bdc3c7",
  },

  cancelText: {
    color: "white",
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});