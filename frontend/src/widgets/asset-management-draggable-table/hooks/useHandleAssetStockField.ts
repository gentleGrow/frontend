import { useState } from "react";
import { fieldIemFactory } from "@/widgets/asset-management-draggable-table/utils/fieldItemFactory";
import { usePutAssetField } from "@/entities/assetManagement/queries/usePutAssetField";

interface UseHandleAssetStockFieldParams {
  fieldsList: {
    all: string[];
    received: string[];
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
    [...fieldsList.received, ...lastField].map((field) =>
      fieldIemFactory(field, fieldsList.received),
    ) ?? [],
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
      name: string;
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
