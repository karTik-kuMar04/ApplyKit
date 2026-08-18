// lib/api/api.ts

import axios from "axios";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL
});

export async function fetchResume() {
  try {
    const res = await api.get("/api/resume/meta");

    return res.data;
  } catch (error) {
    console.error("fetchResume error:", error);
    throw error;
  }
}

export default api;