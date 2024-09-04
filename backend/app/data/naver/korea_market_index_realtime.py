import requests
from bs4 import BeautifulSoup

url = "https://finance.naver.com/"

response = requests.get(url)
response.raise_for_status()

soup = BeautifulSoup(response.content, 'html.parser')

kospi_section = soup.find('div', {'class': 'heading_area'})
kosdaq_section = soup.find('div', {'class': 'heading_area'})

kospi_index = kospi_section.find('span', {'class': 'num'}).text.strip()
kospi_change = kospi_section.find('span', {'class': 'num_s'}).text.strip()

kosdaq_index = kosdaq_section.find('span', {'class': 'num'}).text.strip()
kosdaq_change = kosdaq_section.find('span', {'class': 'num_s'}).text.strip()

print(f"KOSPI: {kospi_index} ({kospi_change})")
print(f"KOSDAQ: {kosdaq_index} ({kosdaq_change})")
