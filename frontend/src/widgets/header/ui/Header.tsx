import LogoLink from "./LogoLink";
import Menus from "./Menu";
import Profile from "./Profile";

export default function Header() {
  return (
    <header className="shadow-header z-9999 mx-auto flex h-[64px] w-full items-center justify-between px-[20px]">
      <div className="flex">
        <div className="mr-[96px] mobile:hidden">
          <LogoLink />
        </div>
        <Menus />
      </div>
      <div className="flex items-center">
        <div className="ml-[60px] flex space-x-[8px]">
          <Profile />
        </div>
      </div>
    </header>
  );
}
