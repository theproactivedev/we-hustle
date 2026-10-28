import axios from 'axios'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const http = axios.create({
  baseURL: API_URL,
  timeout: 60_000, // Render's free tier can take ~1 minute to wake up
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})