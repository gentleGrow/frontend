export default function IncDecRate({ rate }: { rate: number }) {
  return (
    <div
      className={`text-body-4 rounded-md px-[8px] py-[3px] ${rate === 0 ? "bg-gray-5 text-gray-50" : rate > 0 ? "bg-alert/10 text-alert" : "bg-decrease/10 text-decrease"}`}
    >
      {rate > 0 && "+"}
      {rate}%
    </div>
  );
}
