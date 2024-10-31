import Link from "next/link";

export default function NoDataMessage() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <p className="text-center text-sm">
        표시할 데이터가 없어요.
        <br />
        <Link className="font-bold text-green-60" href={"/asset-management"}>
          시트
        </Link>
        에서 투자 정보를 먼저 입력해 주세요.
      </p>
    </div>
  );
}
