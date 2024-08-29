import Card from "@/shared/ui/Card";

interface SummaryCardProps {
  title?: string;
  type?: string;
  amount?: number;
}

export default function SummaryCard({ title, amount }: SummaryCardProps) {
  return (
    <div className="flex-1">
      <Card title={title} height="100px">
        {amount && <p>{amount}</p>}
      </Card>
    </div>
  );
}
