import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const keyStore = createQueryKeyStore({
  summary: {
    getSummary: null,
  },
  assetStock: {
    getSummary: null,
    postAssetStock: null,
    patchAssetStock: null,
    deleteAssetField: null,
  },
  assetField: {
    putAssetField: null,
  },
  user: {
    getUser: null,
  },
});
