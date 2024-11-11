export default function IncDecRate({
  rate,
  className = "",
}: {
  rate: number;
  className?: string;
}) {
  // 양수는 올림, 음수는 내림하여 둘째 자리까지 표시
  const roundedRate =
    rate > 0
      ? (Math.ceil(rate * 100) / 100).toFixed(0)
      : (Math.floor(rate * 100) / 100).toFixed(0);

  return (
    <div
      aria-label={`The rate is ${
        rate > 0 ? "increased" : rate < 0 ? "decreased" : "unchanged"
      } by ${roundedRate}%`}
      className={`flex h-[24px] min-w-[64px] items-center justify-center rounded-md py-[3px] text-body-4 ${
        rate === 0
          ? "bg-gray-5 text-gray-50"
          : rate > 0
            ? "bg-alert/10 text-alert"
            : "bg-decrease/10 text-decrease"
      } ${className}`}
    >
      {rate > 0 && "+"}
      {roundedRate}%
    </div>
  );
}
