// components/PriceDisplay.js
export default function PriceDisplay({ price }) {
  console.log(price);
  const formattedNumber = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);

  return (
    <div className="w-auto overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-[29px] except-mobile:text-[1.73vw] except-web:text-[24px]">
      {formattedNumber}
    </div>
  );
}
