import LogoLink from "./LogoLink";
import Menus from "./Menu";
import Profile from "./Profile";

export default function Header() {
  return (
    <header className="mx-auto flex h-[64px] w-full max-w-[1400px] items-center justify-between px-[16px]">
      <div className="flex">
        <div className="mr-[120px] mobile:hidden">
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
