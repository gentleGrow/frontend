import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
export interface User {
  email: string;
  nickname: string;
  userId: string;
  isLoggedIn: boolean;
}
const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot find AuthProvider");
  }
  return context;
};

export default useUser;
