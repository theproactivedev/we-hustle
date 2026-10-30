import axios from 'axios'

const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const http = axios.create({
  baseURL: API_URL,
  timeout: 60_000, // Render's free tier can take ~1 minute to wake up
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// http.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token')
//       queryClient.clear()
//       // redirect to login

//     }
//     return Promise.reject(error)
//   }
// )