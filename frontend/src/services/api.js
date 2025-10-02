import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const api = axios.create({
  baseURL: base
});

export default api;
