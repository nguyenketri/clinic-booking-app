import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/api";

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

class AuthService {
  async register(
    email: string,
    password: string,
    name: string,
    phone: string
  ): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
        phone,
        role: "patient",
      });

      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("authToken");
  }

  async getUser(): Promise<UserProfile | null> {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  async updateProfile(
    name: string,
    phone: string
  ): Promise<UserProfile> {
    try {
      const token = await this.getToken();
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        { name, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }
}

export default new AuthService();
