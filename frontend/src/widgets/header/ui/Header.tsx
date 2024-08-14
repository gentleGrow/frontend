import LogoLink from "./LogoLink";
import Menus from "./Menu";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="flex">
      <LogoLink />
      <Menus />
      <SearchBar />
    </header>
  );
}
