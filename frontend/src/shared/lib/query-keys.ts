import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const keyStore = createQueryKeyStore({
  summary: {
    getSummary: null,
  },
  assetStock: {
    getSummary: null,
  },
});
