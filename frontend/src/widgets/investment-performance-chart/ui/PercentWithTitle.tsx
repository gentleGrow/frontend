export default function PercentWithTitle({
  title,
  percent,
}: {
  title: string;
  percent: number;
}) {
  return (
    <div className="flex w-[131px] flex-col py-[8px] max-546:w-1/2">
      <p className="text-body-3">{title}</p>
      <p className="text-[28px] font-bold leading-[33.61px]">{percent}%</p>
    </div>
  );
}
