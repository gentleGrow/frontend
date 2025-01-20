import axios from "axios";
import { SERVICE_SERVER_URL } from "@/shared";

export const baseAxios = axios.create({
  baseURL: SERVICE_SERVER_URL,
  timeout: 10000,
});
