import Link from "next/link";

const UserFeedbackButton = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] items-center justify-center bg-gray-5">
      <Link
        target="_blank"
        className="mx-5 w-full max-w-[442px] rounded-[6px] border border-primary bg-white py-[14.5px] text-center text-body-1 font-bold text-primary hover:border-[#04B656] hover:text-[#04B656]"
        href="https://docs.google.com/forms/d/e/1FAIpQLSfM6rUn-hlvUc6BIL_q_fEfpn12swmD3MRPNv4cRTjJNikeOg/viewform?usp=header"
      >
        올라쓰에 바라는 점을 알려주세요!
      </Link>
    </div>
  );
};

export default UserFeedbackButton;
