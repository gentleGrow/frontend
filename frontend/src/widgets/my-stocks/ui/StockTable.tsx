import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StockTable({ stocks }: { stocks: any[] }) {
  const blackSpace = (6 - stocks.length) * 48 - 4;
  return (
    <>
      <Table className="text-body-2 mobile:min-w-[600px]">
        <TableHeader>
          <TableRow className="border-gray-20">
            <TableHead className="max-w-[160px]">종목명</TableHead>
            <TableHead className="max-w-[151px] text-right">현재가</TableHead>
            <TableHead className="max-w-[120px] text-right">수익률</TableHead>
            <TableHead className="max-w-[151px] text-right">수익금</TableHead>
            <TableHead className="max-w-[90px] text-right">수량</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock, i) => (
            <TableRow key={i} className="h-[48px] border-none">
              <TableCell className="max-w-[160px] truncate">
                {stock.name}
              </TableCell>

              <TableCell className="max-w-[151px] truncate text-right">
                ₩{stock.current_price.toLocaleString("ko-KR")}
              </TableCell>
              <TableCell
                className={`max-w-[151px] truncate text-right ${stock.profit_rate < 0 && "text-decrease"} ${stock.profit_rate > 0 && "text-alert"}`}
              >
                {stock.profit_rate > 0 && "+"}
                {stock.profit_rate}%
              </TableCell>
              <TableCell className="max-w-[151px] truncate text-right">
                ₩{stock.profit_amount.toLocaleString("ko-KR")}
              </TableCell>
              <TableCell className="max-w-[90px] truncate text-right">
                {stock.quantity.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {stocks.length < 6 && (
        <>
          <div className={`h-[1px] w-full bg-gray-20`} />
          <div
            className={`rounded-xl bg-white`}
            style={{ height: `${blackSpace}px` }}
          />
        </>
      )}
    </>
  );
}
