"use client";

export default function SheetError({ error }: { error: Error }) {
  return <div>{Object.keys(error.message)}</div>;
}
