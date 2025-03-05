// components/PriceDisplay.js
export default function PriceDisplay({ price }) {
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);

  return (
    <div className="w-full overflow-hidden truncate font-bold leading-[33.6px] except-mobile:text-[28px]">
      {formattedNumber}
    </div>
  );
}
