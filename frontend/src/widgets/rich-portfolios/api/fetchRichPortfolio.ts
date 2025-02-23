import { DonutChartData, fetchWithTimeout, getServiceUrl } from "@/shared";

interface Portfolio {
  name: string;
  data: DonutChartData[];
}
const fetchRichPortfolio = async (): Promise<Portfolio[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/rich-portfolio`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default fetchRichPortfolio;
