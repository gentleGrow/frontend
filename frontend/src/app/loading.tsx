const RootLoading = () => {
  return (
    <div className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-2">
      <svg
        width="49"
        height="48"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M37.9865 0L32.067 12.6918H21.9528L27.8723 0H31.7592H37.9865ZM4.44281 28.5628L10.3585 15.871H20.4764L14.557 28.5628H9.38679H4.44281ZM13.0739 31.7326H7.90368H2.95971L0 38.0786H10.1142L13.0739 31.7326ZM20.6624 48.0001H16.7755H10.5445L16.4639 35.3083H22.6912H26.5781L20.6624 48.0001ZM33.2283 32.13H38.1723L44.0917 19.4382H39.144H33.9738L28.0581 32.13H33.2283ZM40.6273 16.2694H35.4571L38.4168 9.92348H48.531L45.575 16.2694H40.6273Z"
          fill="url(#paint0_linear_4626_1061)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_4626_1061"
            x1="32.5694"
            y1="3.46778e-07"
            x2="16.2846"
            y2="47.9971"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#4BF198" />
            <stop offset="1" stop-color="#05D665" />
          </linearGradient>
        </defs>
      </svg>

      <span className="text-xl font-semibold">데이터를 가져오는 중입니다.</span>
    </div>
  );
};

export default RootLoading;
