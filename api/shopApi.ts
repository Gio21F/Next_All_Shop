import axios from "axios";
import Cookies from "js-cookie";

const shopApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEST_URL,
});

shopApi.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globalmente (opcional)
shopApi.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Maneja errores aquí
  // console.error('Error en la respuesta de Axioss:', error.response.data);
  return Promise.reject(error);
});

export default shopApi;