import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function Booking() {
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleBooking = () => {
    alert(`Booked on ${date} for ${guests} guests`);
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Booking</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        
        <Text style={styles.label}>Select Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        <Text style={styles.label}>Number of Guests</Text>
        <TextInput
          placeholder="Enter number"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  backText: {
    fontSize: 16,
    color: "blue",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  form: {
    flex: 1,
  },

  label: {
    marginBottom: 5,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});