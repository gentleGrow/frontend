import { useDebounce } from "@/shared/hooks/useDebounce";
import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0);

  const debouncedHandleResize = useDebounce(() => {
    setWidth(window?.innerWidth);
  }, 300);

  useEffect(() => {
    window?.addEventListener("resize", debouncedHandleResize);

    return () => {
      window?.removeEventListener("resize", debouncedHandleResize);
    };
  }, [debouncedHandleResize]);

  useEffect(() => {
    setWidth(window?.innerWidth);
  }, []);

  return width;
};
