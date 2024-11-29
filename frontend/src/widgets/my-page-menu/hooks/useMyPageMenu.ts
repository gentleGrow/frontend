"use client";

import { useState } from "react";

const useMyPageMenu = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>("마이페이지");
  return { selectedMenu, setSelectedMenu };
};
export default useMyPageMenu;
