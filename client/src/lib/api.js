import axios from "axios";

// En desarrollo usa el servidor local. En producción, definir VITE_API_URL
// (por ejemplo: https://api.tudominio.com/api) en el proveedor de hosting.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
