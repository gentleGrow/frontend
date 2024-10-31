import { essentialFields } from "@/widgets/asset-management-draggable-table/constants/essentialFields";

export const fieldIsRequired = (field: string) =>
  essentialFields.includes(field);
