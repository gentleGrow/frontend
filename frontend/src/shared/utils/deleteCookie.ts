"use server";
import { cookies } from "next/headers";

const deleteCookie = (key: string) => {
  cookies().delete(key);
};
export default deleteCookie;
