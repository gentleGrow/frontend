import { ErrorComponent } from "next/dist/client/components/error-boundary";

const CommonErrorFallback: ErrorComponent = ({ error, reset }) => {
  return (
    <div className="">
      <h1>에러가 발생했습니다.</h1>
      <pre>{error.message}</pre>
      <button onClick={reset}>페이지 새로고침</button>
    </div>
  );
};

export default CommonErrorFallback;
