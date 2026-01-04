import axios from "axios";
import { API_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⭐ WAJIB
});

export const apiPublic = axios.create({
  baseURL: API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ⭐ WAJIB
});
