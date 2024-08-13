import MenuItem from "./MenuItem";
const MENUS = [
  { name: "홈", href: "/" },
  { name: "자산관리", href: "/asset-management" },
];
export default function Menus() {
  return (
    <nav className="flex space-x-[150px]">
      {MENUS.map((menu) => (
        <div key={menu.name}>
          <MenuItem menu={menu} />
        </div>
      ))}
    </nav>
  );
}
