import { LineButton } from "@/shared";

export default function GoogleLoginButton() {
  return (
    <LineButton title="구글로 계속하기">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.8215 10.2271C19.8215 9.51804 19.7578 8.83624 19.6393 8.18164H10.2004V12.0498H15.594C15.3617 13.2998 14.6557 14.3589 13.5943 15.068V17.5771H16.8332C18.7282 15.8362 19.8215 13.2725 19.8215 10.2271Z"
          fill="#4285F4"
        />
        <path
          d="M10.2004 20.0003C12.9063 20.0003 15.1749 19.1048 16.833 17.5776L13.5941 15.0685C12.6967 15.6685 11.5487 16.023 10.2004 16.023C7.59007 16.023 5.38074 14.2639 4.59261 11.9003H1.24438V14.4912C2.89349 17.7594 6.28271 20.0003 10.2004 20.0003Z"
          fill="#34A853"
        />
        <path
          d="M4.59263 11.9007C4.39219 11.3007 4.27834 10.6598 4.27834 10.0007C4.27834 9.34157 4.39219 8.70067 4.59263 8.10067V5.50977H1.2444C0.565714 6.85977 0.178467 8.38707 0.178467 10.0007C0.178467 11.6143 0.565714 13.1416 1.2444 14.4916L4.59263 11.9007Z"
          fill="#FBBC04"
        />
        <path
          d="M10.2004 3.9773C11.6717 3.9773 12.9928 4.4818 14.0315 5.4727L16.906 2.6045C15.1704 0.9909 12.9017 0 10.2004 0C6.28271 0 2.89349 2.2409 1.24438 5.5091L4.59261 8.1C5.38074 5.7364 7.59007 3.9773 10.2004 3.9773Z"
          fill="#E94235"
        />
      </svg>
    </LineButton>
  );
}
