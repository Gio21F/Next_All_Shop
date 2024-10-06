import axios from "axios";

const shopApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NEST_URL,
});

shopApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default shopApi;