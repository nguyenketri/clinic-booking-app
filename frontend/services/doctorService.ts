import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/api";

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  price: number;
  experience: number;
  rating?: number;
  totalRatings?: number;
}

class DoctorService {
  async getDoctors(specialty: string | null = null): Promise<Doctor[]> {
    try {
      let url = `${API_URL}/doctors`;
      if (specialty) {
        url += `?specialty=${specialty}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const response = await axios.get(`${API_URL}/doctors/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }

  async getSpecialties(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_URL}/doctors/specialties`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw axiosError.response?.data?.message || (error as Error).message;
    }
  }
}

export default new DoctorService();
