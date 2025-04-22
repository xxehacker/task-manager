import axios from "axios";
import { BASE_URL } from "./apiPath";

const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default AXIOS_INSTANCE;
