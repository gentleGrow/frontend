### [Auth 플로우]
1. end user는 client side에게 로그인 요청을 합니다.
2. client side는 구글 폼으로 로그인으로 재접속시킵니다.
3. end user는 id/pw를 입력해 로그인합니다.
4. 로그인이 되었다면, 구글은 client side에게 access token과 refresh token을 전달하고 홈페이지로 redirect합니다.
5. client side는 server side에게 access token과 refresh token을 전달합니다. (client side는 보안을 위해 refresh token을 가지고 있지 않습니다.)
6. server side는 refresh token을 저장하고, access token을 확인후, jwt 토큰을 반환합니다.
7. client side는 jwt token을 받아 유저 인가 용도로 사용합니다.
9. jwt가 expired되면 서버에게 old jwt를 넘겨 새로운 jwt를 요청합니다.
10. server side는 refresh token을 이용해 google session이 활성화 되어 있는지 확인후, 새로운 jwt를 발급합니다.



### [고려사항]
1. 구글-카카오-네이버의 로그인시 1명의 유저로 연동
