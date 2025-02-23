import { fetchWithTimeout, getServiceUrl } from "@/shared";

const fetchTodayTip = async (): Promise<string> => {
  try {
    const response = await fetchWithTimeout(
      `${getServiceUrl()}/api/chart/v1/tip`,
    );
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.json()}`);
    }
    const todayTip = await response.json();
    return todayTip;
  } catch (error) {
    console.error(error);
    return "오늘의 투자 팁을 가져오지 못했어요.";
  }
};

export default fetchTodayTip;
