import { DonutChartData, fetchWithTimeout, getServiceUrl } from "@/shared";

interface Portfolio {
  name: string;
  data: DonutChartData[];
}
const fetchExplorePortfolio = async (): Promise<Portfolio[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/people-portfolio`,
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

export default fetchExplorePortfolio;
