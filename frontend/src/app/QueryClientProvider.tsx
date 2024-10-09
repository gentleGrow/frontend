"use client";

import {
  QueryClient,
  QueryClientProvider as OriginQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export default function QueryClientProvider({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <OriginQueryClientProvider client={queryClient}>
      {children}
    </OriginQueryClientProvider>
  );
}
