'use client';
import { Dispatch, SetStateAction } from 'react';
import S from './Login.module.scss';
import { signIn } from 'next-auth/react';
export default function Login() {
  const handleKaKao = async () => {
    await signIn('kakao', { callbackUrl: '/' });
  };
  return (
    <div className={S.modalWrap}>
      <div className={S.loginContainer}>
        <button className={S.closeBtn}></button>
        <div className={S.loginText}>
          <p>시작하기</p>
          <p>
            투자 현황을 기록하고 분석해 더 나은 투자를 만들어 갑니다. <br />
            간편 로그인으로 쉽고 빠르게 서비스를 시작하세요.
          </p>
        </div>
        <div className={S.loginForm}>
          <button className={S.kakaoBtn} onClick={handleKaKao}>
            카카오로 계속하기
          </button>
          <button className={S.naverBtn}>네이버로 계속하기</button>
          <button className={S.googleBtn}>구글로 계속하기</button>
        </div>
      </div>
    </div>
  );
}
