import { Platform } from "react-native";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === "android"
    ? "http://10.0.2.2:5001"
    : "http://localhost:5001");

export const CONFIG = {
  API_BASE_URL,
  REQUEST_TIMEOUT: 15000,
} as const;
