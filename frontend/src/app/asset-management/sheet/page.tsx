// pages/asset/sheet/page.tsx
import Summary from "@/widgets/card/Summary";

const Sheet = () => {
  const SUMMARYDATA = [
    { title: "총 자산", type: "amount", amount: 1345600 },
    { title: "투자 금액", type: "amount", amount: 762924 },
    { title: "수익금", type: "amount", amount: 120924 },
    { title: "배당금", type: "amount", amount: 7521 },
  ];

  return (
    <div>
      <Summary summaryData={SUMMARYDATA} />
    </div>
  );
};

export default Sheet;
