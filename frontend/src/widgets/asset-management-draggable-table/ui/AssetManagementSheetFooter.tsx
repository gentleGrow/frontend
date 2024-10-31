const AssetManagementSheetFooter = () => {
  return (
    <footer className="flex flex-row items-center gap-1">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="7.375" stroke="#5D646E" strokeWidth="1.25" />
        <circle cx="10" cy="6.99219" r="0.75" fill="#5D646E" />
        <rect x="9.375" y="8.75977" width="1.25" height="5" fill="#5D646E" />
      </svg>
      <span className="text-body-2 text-gray-60">
        실시간 수치와는 다소 차이가 있을 수 있습니다.
      </span>
    </footer>
  );
};

export default AssetManagementSheetFooter;
