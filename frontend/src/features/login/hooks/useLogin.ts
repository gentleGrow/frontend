"use client";
import { useEffect, useState } from "react";

const useLogin = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 545) {
        setIsMobile(true);
        document.body.style.overflow = "hidden";
      } else {
        setIsMobile(false);
        document.body.style.overflow = "auto";
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return { isMobile };
};

export default useLogin;
