import LogoLink from "./LogoLink";
import Menus from "./Menu";
import Profile from "./Profile";

export default function Header() {
  return (
    <header className="shadow-header z-9999 mx-auto flex h-[64px] w-full items-center justify-between px-[20px]">
      <div className="flex gap-12 except-mobile:gap-36">
        <LogoLink />
        <Menus />
      </div>
      <div className="flex items-center">
        <Profile />
      </div>
    </header>
  );
}
