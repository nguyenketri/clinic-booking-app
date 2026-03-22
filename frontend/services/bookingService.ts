import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Booking {
  _id: string;
  patientId: string;
  doctorId: {
    _id: string;
    name: string;
    specialty: string;
    price: number;
    experience: number;
    rating?: number;
  };
  patientName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  totalPrice: number;
  rating?: number;
  review?: string;
}

interface BookingInput {
  patientName: string;
  phone: string;
  email?: string;
  date: Date;
  time: string;
  notes?: string;
  doctorId: string;
}

class BookingService {
  async createBooking(bookingData: BookingInput): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async getMyBookings(): Promise<Booking[]> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async updateBooking(id: string, bookingData: Partial<BookingInput>): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.put(`${API_URL}/bookings/${id}`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async cancelBooking(id: string): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.patch(`${API_URL}/bookings/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async rateBooking(id: string, rating: number, review: string): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/bookings/${id}/rate`,
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async mockPayment(bookingId: string, success: boolean = true): Promise<Booking> {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await axios.post(
        `${API_URL}/payment/mock`,
        { bookingId, success },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }
}

export default new BookingService();
