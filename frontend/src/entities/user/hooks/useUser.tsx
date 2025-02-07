import { useContext } from "react";
import { AuthContext } from "@/entities";

const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Cannot find AuthProvider");
  }
  return context;
};

export default useUser;
