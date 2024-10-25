// components/PriceDisplay.js
export default function PriceDisplay({ price }) {
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);

  return (
    <div className="line-clamp-1 w-auto overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-[33px] except-mobile:text-[28px]">
      {formattedNumber}
    </div>
  );
}
