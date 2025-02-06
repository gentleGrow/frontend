import { clientEnv } from "@/shared/config/client-env";

export default function NaverLoginButton() {
  return (
    <form
      action={`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientEnv.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${clientEnv.NEXT_PUBLIC_NAVER_REDIRECT_URI}&state=${clientEnv.NEXT_PUBLIC_NAVER_STATE_STRING}`}
      method="POST"
      className="w-full"
    >
      <button className="relative flex w-full items-center justify-center rounded-[8px] border-[#03C75A] bg-[#03C75A] px-3.5 py-4 text-white">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
        >
          <path
            d="M13.035 10.59L6.72669 1.57019H1.50024V18.4297H6.97958V9.40986L13.2738 18.4297H18.5002V1.57019H13.035V10.59Z"
            fill="white"
          />
        </svg>
        <span className="text-[16px] font-semibold leading-[19.2px]">
          네이버로 계속하기
        </span>
      </button>
    </form>
  );
}
