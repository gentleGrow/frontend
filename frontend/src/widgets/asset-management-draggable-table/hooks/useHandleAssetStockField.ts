import { useState } from "react";
import { fieldIemFactory } from "@/widgets/asset-management-draggable-table/utils/fieldItemFactory";
import { usePutAssetField } from "@/entities/asset-management/queries/usePutAssetField";
import { allField } from "@/entities/asset-management/constants/allField";

interface UseHandleAssetStockFieldParams {
  fieldsList: {
    all: typeof allField;
    received: Partial<typeof allField>;
  };
  accessToken: string | null;
}

export const useHandleAssetStockField = ({
  fieldsList,
  accessToken,
}: UseHandleAssetStockFieldParams) => {
  const { mutate: updateAssetField } = usePutAssetField();

  const lastField = fieldsList.all.filter(
    (field) => !fieldsList.received.includes(field),
  );
  const [fields, setFields] = useState(
    [...fieldsList.received, ...lastField]
      .filter((field) => field !== undefined)
      .map((field) => fieldIemFactory(field, fieldsList.received)) ?? [],
  );

  const handleReset = () => {
    setFields((prev) => {
      return prev.map((field) => {
        if (field.isRequired) {
          return field;
        }

        return {
          ...field,
          isChecked: false,
        };
      });
    });
  };

  const handleChange = (
    newFields: {
      isRequired: boolean;
      isChecked: boolean;
      name: (typeof allField)[number];
    }[],
  ) => {
    setFields(newFields);
    const valueToUpdate = newFields
      .filter((field) => field.isChecked || field.isRequired)
      .map((field) => field.name);

    if (accessToken) {
      updateAssetField({ accessToken, newFields: valueToUpdate });
    }
  };

  return {
    fields,
    handleReset,
    handleChange,
  };
};
