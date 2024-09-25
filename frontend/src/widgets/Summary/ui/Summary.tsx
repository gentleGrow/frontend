import fetchSummary from "../api/fetchSummary";
import SummaryCard from "./SummaryCard";

export default async function Summary() {
  const summary = await fetchSummary();
  return (
    <div className="flex space-x-[16px]">
      {}
      {Object.keys(summary).map((title) => (
        <SummaryCard key={title} title={title} amount={summary[title]} />
      ))}
    </div>
  );
}
