import LogoLink from "./LogoLink";
import Menus from "./Menu";

export default function Header() {
  return (
    <header className="flex">
      <LogoLink />
      <Menus />
    </header>
  );
}
