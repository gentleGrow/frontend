import { promises as fs } from "fs";
import path from "path";
import fetch from "node-fetch";

const main = () => {
  const API_KEY = process.env.KR_HOLIDAYS_API_KEY;

  const API_URL =
    "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

  if (!API_KEY) {
    console.error("holiday-kr.mjs: API key is not provided.");
    return;
  }

// 시작 날짜와 현재 날짜를 설정합니다.
  let startDate = new Date(2000, 0, 1); // 2000년 1월 1일
  const curDate = new Date(); // 현재 날짜

  (async () => {
    while (
      startDate.getFullYear() < curDate.getFullYear() ||
      (startDate.getFullYear() === curDate.getFullYear() &&
        startDate.getMonth() <= curDate.getMonth())
      ) {
      const isExist = await fs.
      access(path.join(".", "public", "data", "holiday", `${startDate.getFullYear()}-${startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1}.xml`))
        .then(() => true)
        .catch(() => false);

      if (isExist) {
        console.log(`Holidays for ${startDate.getFullYear()}-${startDate.getMonth() + 1} already exist.`);
        startDate.setMonth(startDate.getMonth() + 1);
        continue
      }

      const curYear = startDate.getFullYear();
      const curMonth = startDate.getMonth() + 1;

      // API 요청 파라미터를 구성합니다.
      let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + API_KEY;
      queryParams +=
        "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
      queryParams +=
        "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("100"); // 충분히 큰 값으로 설정
      queryParams +=
        "&" + encodeURIComponent("solYear") + "=" + encodeURIComponent(curYear);
      queryParams +=
        "&" +
        encodeURIComponent("solMonth") +
        "=" +
        encodeURIComponent(curMonth < 10 ? "0" + curMonth : curMonth.toString());

      try {
        const res = await fetch(API_URL + queryParams);
        const body = await res.text();

        body.includes("errMsg") && console.log(`Error fetching holidays for ${curYear}-${curMonth}:`, body);

        // 저장할 디렉토리를 생성합니다.
        const dirPath = path.join(".", "public", "data", "holiday");
        await fs.mkdir(dirPath, { recursive: true });

        // 파일 경로를 설정하고 데이터를 저장합니다.
        const filePath = path.join(
          dirPath,
          `${curYear}-${curMonth < 10 ? "0" + curMonth : curMonth}.xml`,
        );

        await fs.writeFile(
          filePath,
          body,
          "utf-8",
        );

        console.log(`Saved holidays for ${curYear}-${curMonth}`);
      } catch (err) {
        console.error(`Error fetching holidays for ${curYear}-${curMonth}:`, err);
      }

      // 다음 달로 이동합니다.
      startDate.setMonth(startDate.getMonth() + 1);
    }
  })();

}


main();
