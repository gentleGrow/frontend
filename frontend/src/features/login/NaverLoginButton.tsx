import { clientEnv } from "@/shared/config/client-env";
import { LineButton } from "@/shared";

export default function NaverLoginButton() {
  return (
    <form
      action={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientEnv.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${clientEnv.NEXT_PUBLIC_NAVER_REDIRECT_URI}&state=${clientEnv.NEXT_PUBLIC_NAVER_STATE_STRING}`}
      method="GET"
      className="w-full"
    >
      <LineButton
        title="네이버로 계속하기"
        props={{
          className: "bg-[#03C75A] text-white border-[#03C75A]",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.035 10.59L6.72669 1.57019H1.50024V18.4297H6.97958V9.40986L13.2738 18.4297H18.5002V1.57019H13.035V10.59Z"
            fill="white"
          />
        </svg>
      </LineButton>
    </form>
  );
}
