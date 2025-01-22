import { fieldIsRequired } from "@/widgets/asset-management-draggable-table/utils/fieldIsRequired";
import { allField } from "@/entities/asset-management/constants/allField";

export const fieldIemFactory = (
  field: (typeof allField)[number],
  userFields: Partial<typeof allField>,
) => ({
  isRequired: fieldIsRequired(field),
  isChecked: userFields.includes(field) || fieldIsRequired(field),
  name: field,
});
