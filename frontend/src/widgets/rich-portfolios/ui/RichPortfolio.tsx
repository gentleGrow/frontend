import fetchRichPortfolio from "../api/fetchRichPortfolio";
import ExplorePortfolioGallery from "./RichPortfolioGallery";

export default async function RichPortfolio() {
  const data = await fetchRichPortfolio();

  return (
    <div className="relative h-[288px] space-y-[16px] rounded-lg border-gray-20 bg-white p-[16px] except-mobile:border">
      <div className="flex justify-between">
        <h2 className="text-heading-2">부자들의 포트폴리오</h2>
      </div>
      <ExplorePortfolioGallery data={data} />
    </div>
  );
}
