import { useRef } from "react";

const useAutoScroll = (scrollContainerRef: React.RefObject<HTMLDivElement>) => {
  const animationFrameId = useRef<number | null>(null);
  const currentPointerX = useRef<number>(0);

  const autoScroll = () => {
    if (!scrollContainerRef.current) return;

    const pointerX = currentPointerX.current;
    const containerRect = scrollContainerRef.current.getBoundingClientRect();

    const scrollThreshold = 50; // 스크롤을 시작할 영역의 너비
    const scrollSpeed = 5; // 스크롤 속도 조절

    if (pointerX < scrollThreshold) {
      // 왼쪽으로 스크롤
      scrollContainerRef.current.scrollBy({
        left: -scrollSpeed,
        behavior: "auto",
      });
    } else if (containerRect.right - pointerX < scrollThreshold) {
      // 오른쪽으로 스크롤
      scrollContainerRef.current.scrollBy({
        left: scrollSpeed,
        behavior: "auto",
      });
    }

    animationFrameId.current = requestAnimationFrame(autoScroll);
  };

  const startAutoScroll = () => {
    if (animationFrameId.current !== null) return;
    autoScroll();
  };

  const stopAutoScroll = () => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const updatePointer = (clientX: number) => {
    currentPointerX.current = clientX;
  };

  return { startAutoScroll, stopAutoScroll, updatePointer };
};

export default useAutoScroll;
