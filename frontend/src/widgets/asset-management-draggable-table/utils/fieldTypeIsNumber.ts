import { numberFields } from "@/widgets/asset-management-draggable-table/constants/numberFields";

export const fieldTypeIsNumber = (field: string) => {
  return numberFields.includes(field);
};
