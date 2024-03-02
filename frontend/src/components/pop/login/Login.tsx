'use client';
import S from './Login.module.scss';
export default function Login() {
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
          <button className={S.kakaoBtn}>카카오로 계속하기</button>
          <button className={S.naverBtn}>네이버로 계속하기</button>
          <button className={S.googleBtn}>구글로 계속하기</button>
        </div>
      </div>
    </div>
  );
}
