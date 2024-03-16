import FinanceDataReader as fdr

symbol = "005930"

df = fdr.DataReader(symbol, "2020-01-01", "2020-12-31")

print(df.head())
