import useMyPageMenu from "../hooks/useMyPageMenu";

export default function MyPageMenu() {
  const { selectedMenu, setSelectedMenu } = useMyPageMenu();
  return (
    <nav>
      <ul>
        <li>마이페이지</li>
      </ul>
    </nav>
  );
}
