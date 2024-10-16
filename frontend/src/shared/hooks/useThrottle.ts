import { useRef } from "react";
import { usePreservedCallback } from "@/shared/hooks/usePreservedCallback";

export function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  return {
    throttledFn: usePreservedCallback((...args: Parameters<F>) => {
      if (timer.current) {
        return;
      }

      timer.current = setTimeout(() => {
        callbackRef.current(...args);
        timer.current = null;
      }, wait);
    }),

    cancel: () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    },
  };
}
