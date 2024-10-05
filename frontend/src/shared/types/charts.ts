export interface LineChartValuesData {
  values: number[];
  name: string;
}

export interface LineChartData {
  xAxises: string[];
  dates: string[];
  values1: LineChartValuesData;
  values2: LineChartValuesData;
  unit: string;
  myReturnRate?: number;
  contrastMarketReturns?: number;
}

export interface DonutChartData {
  name: string;
  percent_rate: number;
  current_amount: number;
}

export interface BarChartData {
  xAxises: string[];
  data: number[];
  unit: string;
  total?: number;
}

export interface EstimateDividendAllData {
  [key: string]: BarChartData;
}
