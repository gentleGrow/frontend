import SummaryCard from "@/widgets/Summary/ui/SummaryCard";

interface AssetManagementSummaryCardProps {
  title?: string;
  value?: number;
  ratio?: number;
}

const AssetManagementSummaryCard = ({
  title,
  value,
  ratio,
}: AssetManagementSummaryCardProps) => {
  return <SummaryCard title={title} amount={value} rate={ratio} />;
};

export default AssetManagementSummaryCard;
