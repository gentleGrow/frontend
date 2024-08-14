import LogoLink from "./LogoLink";
import Menus from "./Menu";
import Notification from "./Notification";
import Profile from "./Profile";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="flex h-[64px] w-full items-center justify-around">
      <div className="flex">
        <div className="mr-[60px]">
          <LogoLink />
        </div>
        <Menus />
      </div>
      <div className="flex items-center">
        <SearchBar />
        <div className="ml-[60px] flex space-x-[8px]">
          <Notification />
          <Profile />
        </div>
      </div>
    </header>
  );
}
