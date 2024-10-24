import fetchExplorePortfolio from "../api/fetchExplorePortfolio";
import ExplorePortfolioGallery from "./ExplorePortfolioGallery";

export default async function ExplorePortfolio() {
  const data = await fetchExplorePortfolio();
  return (
    <div className="relative h-[288px] space-y-[16px] rounded-lg border-gray-20 bg-white p-[16px] except-mobile:border">
      <div className="flex justify-between">
        <h2 className="text-heading-2 text-gray-80">포트폴리오 구경하기</h2>
      </div>
      <ExplorePortfolioGallery data={data} />
    </div>
  );
}
