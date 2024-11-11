"use client";
import Link from "next/link";
import useMyPageMenu from "../hooks/useMyPageMenu";
const MY_PAGE_MENU = [{ name: "마이페이지", href: "/my-page" }];
export default function MyPageMenu() {
  const { selectedMenu, setSelectedMenu } = useMyPageMenu();
  return (
    <nav className="min-w-[328px]">
      <ul>
        {MY_PAGE_MENU.map((menu) => (
          <li
            key={menu.name}
            className={`p-4 ${selectedMenu === menu.name ? "text-heading-2 text-gray-100" : "text-[20px] text-gray-60"} hover:bg-gray-5`}
          >
            <Link
              href={"/my-page"}
              onClick={() => {
                setSelectedMenu(menu.name);
              }}
            >
              마이페이지
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
