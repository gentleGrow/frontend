import { CurrencyType } from "@/widgets/asset-management-draggable-table/constants/currencyType";

export let NewFieldId = -1;

export const buildEmptyStock = (currencySetting: CurrencyType) => {
  return {
    id: NewFieldId--,
    주식통화: currencySetting,
    종목명: {
      isRequired: true,
      value: undefined,
    },
    수량: {
      isRequired: true,
      value: undefined,
    },
    구매일자: {
      isRequired: true,
      value: undefined,
    },
    증권사: {
      isRequired: true,
      value: undefined,
    },
    계좌종류: {
      isRequired: true,
      value: undefined,
    },
    수익률: {
      isRequired: false,
      value: undefined,
    },
    시가: {
      isRequired: false,
      value: undefined,
    },
    고가: {
      isRequired: false,
      value: undefined,
    },
    저가: {
      isRequired: false,
      value: undefined,
    },
    거래량: {
      isRequired: false,
      value: undefined,
    },
    배당금: {
      isRequired: false,
      value: undefined,
    },
    매입금: {
      isRequired: false,
      value: undefined,
    },
    현재가: {
      isRequired: false,
      value: undefined,
    },
    수익금: {
      isRequired: false,
      value: undefined,
    },
    매입가: {
      isRequired: false,
      value: undefined,
    },
  };
};
