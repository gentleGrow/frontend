import { SERVICE_SERVER_URL } from "@/shared";
export interface Indexes {
  name: string;
  name_kr: string;
  current_value: number;
  change_percent: number;
}
const fetchIndexes = async (): Promise<Indexes[]> => {
  try {
    const response = await fetch(`${SERVICE_SERVER_URL}/api/chart/v1/indice`);
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    const indexes = await response.json().then((data) => data.market_indices);
    return indexes;
  } catch (error) {
    console.error(error);
    return [];
  }
};
export default fetchIndexes;
