import { fetchWithTimeout, getServiceUrl } from "@/shared";

export interface RichPick {
  name: string;
  price: number;
  rate: number;
}
const fetchRichPicks = async (): Promise<RichPick[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/rich-pick`,
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

export default fetchRichPicks;
