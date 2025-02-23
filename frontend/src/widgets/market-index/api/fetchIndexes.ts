import { fetchWithTimeout, getServiceUrl } from "@/shared";

export interface Indexes {
  name: string;
  name_kr: string;
  current_value: number;
  change_percent: number;
}
const fetchIndexes = async (): Promise<Indexes[]> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/indice`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
export default fetchIndexes;
