import axios from "axios";

const isProduction = import.meta.env.PROD;

const API = axios.create({
  baseURL: isProduction
    ? import.meta.env.VITE_PROD_API_URL
    : import.meta.env.VITE_LOCAL_API_URL,
  withCredentials: true,
});

export default API;