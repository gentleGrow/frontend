import axios from "axios";
import { getServiceUrl } from "@/shared/constants/api";

export const baseAxios = axios.create({
  baseURL: getServiceUrl(),
  timeout: 10000,
});
