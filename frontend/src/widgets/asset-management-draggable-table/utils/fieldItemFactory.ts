import { fieldIsRequired } from "@/widgets/asset-management-draggable-table/utils/fieldIsRequired";

export const fieldIemFactory = (field: string, userFields: string[]) => ({
  isRequired: fieldIsRequired(field),
  isChecked: userFields.includes(field) || fieldIsRequired(field),
  name: field,
});
