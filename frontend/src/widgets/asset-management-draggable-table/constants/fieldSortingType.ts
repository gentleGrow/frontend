export type FieldSortingTypeValue =
  (typeof FieldSortingType)[keyof typeof FieldSortingType];

export const FieldSortingType = {
  ASC: "asc",
  DESC: "desc",
} as const;
