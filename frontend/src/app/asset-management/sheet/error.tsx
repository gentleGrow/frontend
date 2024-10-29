"use client";

export default function SheetError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <h2 className="text-heading-2 text-gray-90">에러가 발생했습니다.</h2>
      <p className="text-body-1 text-gray-60">
        새로고침 후 다시 시도해 주세요.
      </p>
    </div>
  );
}
