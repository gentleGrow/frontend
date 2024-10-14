import { useRef } from "react";
import { usePreservedCallback } from "@/shared/hooks/usePreservedCallback";

export function useDebounce<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  return usePreservedCallback((...args: Parameters<F>) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      callbackRef.current(...args);
    }, wait);
  });
}
