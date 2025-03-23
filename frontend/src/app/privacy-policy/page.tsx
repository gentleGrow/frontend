const PravacyPolicyPage = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col gap-[32px] bg-gray-5 px-4 py-8">
      <h1 className="text-body-1 font-bold text-gray-90">개인정보처리방침</h1>
      
      <div className="text-body-2 text-gray-90 flex flex-col gap-6">
        <p>
          [ollass](이하 &apos;회사&apos;라 함)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>

        <section>
          <h2 className="text-lg font-semibold mb-3">제1조 (개인정보의 처리 목적)</h2>
          <p className="mb-2">
            회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>회원 가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등을 목적으로 개인정보를 처리합니다.</li>
            <li>재화 또는 서비스 제공 자산관리 서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 계약서·청구서 발송, 본인인증, 요금결제·정산 등을 목적으로 개인정보를 처리합니다.</li>
            <li>마케팅 및 광고에의 활용 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제2조 (개인정보의 처리 및 보유 기간)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
            <li>
              각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
              <ol className="list-decimal pl-6 mt-2 space-y-2">
                <li>
                  회원가입 및 관리: 회원탈퇴 시까지
                  <p className="mt-1">다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지</p>
                  <ol className="list-decimal pl-6 mt-1">
                    <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사종료 시까지</li>
                    <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산시까지</li>
                  </ol>
                </li>
                <li>
                  재화 또는 서비스 제공: 서비스 공급완료 및 요금결제·정산 완료시까지
                  <p className="mt-1">다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지</p>
                  <ol className="list-decimal pl-6 mt-1">
                    <li>
                      「전자상거래 등에서의 소비자 보호에 관한 법률」에 따른 표시·광고, 계약 내용 및 이행 등 거래에 관한 기록
                      <ul className="list-disc pl-6 mt-1">
                        <li>표시·광고에 관한 기록: 6개월</li>
                        <li>계약 또는 청약철회, 대금결제, 재화 등의 공급기록: 5년</li>
                        <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
                      </ul>
                    </li>
                    <li>
                      「통신비밀보호법」에 따른 통신사실확인자료 보관
                      <ul className="list-disc pl-6 mt-1">
                        <li>로그인 기록: 3개월</li>
                      </ul>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제3조 (개인정보의 수집 및 처리 항목)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              회사는 다음의 개인정보 항목을 수집하여 처리하고 있습니다.
              <ol className="list-decimal pl-6 mt-2">
                <li>
                  회원가입 및 관리
                  <ul className="list-disc pl-6 mt-1">
                    <li>필수항목: social_id, 이메일 주소, 닉네임</li>
                    <li>선택항목: 없음</li>
                  </ul>
                </li>
                <li>
                  서비스 이용과정에서 자동 생성 및 수집되는 정보
                  <ul className="list-disc pl-6 mt-1">
                    <li>서비스 이용기록, 접속로그, 쿠키, 접속 IP 정보</li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>
              회사는 다음과 같은 방법으로 개인정보를 수집합니다.
              <ol className="list-decimal pl-6 mt-2">
                <li>홈페이지(회원가입, 서비스 이용 과정에서 수집)</li>
                <li>제3자 로그인(구글, 네이버, 카카오) 연동 시 제공받음</li>
              </ol>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제4조 (개인정보의 제3자 제공)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 단, 다음의 각 호의 경우에는 정보주체 또는 제3자의 이익을 부당하게 침해할 우려가 있을 때를 제외하고는 개인정보를 목적 외의 용도로 이용하거나 이를 제3자에게 제공할 수 있습니다.
              <ol className="list-decimal pl-6 mt-2">
                <li>정보주체가 명시적으로 제3자 제공에 동의한 경우</li>
                <li>다른 법률에 특별한 규정이 있는 경우</li>
                <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li>
                <li>통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 개인정보를 제공하는 경우</li>
              </ol>
            </li>
            <li>현재 회사는 이용자의 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 개인정보 제3자 제공이 필요한 경우, 별도의 동의를 받아 정보를 제공하겠습니다.</li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold mb-3">제5조 (개인정보 처리업무의 위탁)</h2>
          <p className="mb-2">회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <p className="font-medium">클라우드 서비스</p>
              <ul className="list-disc pl-6">
                <li>위탁받는 자(수탁자): Amazon Web Services, Inc.</li>
                <li>위탁하는 업무의 내용: 데이터 저장 및 운영</li>
                <li>위탁 처리되는 개인정보: social_id, 이메일</li>
                <li>보유 및 이용기간: 위탁계약 종료 시까지</li>
              </ul>
            </li>
            <li>
              <p className="font-medium">서버 로그 수집 및 오류 모니터링</p>
              <ul className="list-disc pl-6">
                <li>위탁받는 자(수탁자): Sentry</li>
                <li>위탁하는 업무의 내용: 서비스 안정성 모니터링, 오류 로그 수집 및 분석</li>
                <li>위탁 처리되는 개인정보: IP 주소, 브라우저 정보, 오류 발생 시점의 사용자 행동 정보</li>
                <li>보유 및 이용기간: 위탁계약 종료 시까지</li>
              </ul>
            </li>
          </ol>
          <p className="mt-3">회사는 위탁계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
          <p className="mt-2">위탁업무의 내용이나 수탁자가 변경될 경우에는 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제6조 (개인정보의 파기)</h2>
          <p className="mb-2">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
          <p className="mb-2">정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</p>
          <p className="mt-2">개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>파기절차 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
            <li>파기방법 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 로우레벨 포맷(Low Level Format) 등의 방법을 이용하여 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제7조 (개인정보의 안전성 확보조치)</h2>
          <p className="mb-2">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
            <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
            <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제8조 (미성년자에 대한 특별 보호)</h2>
          <p className="mb-2">회사는 만 14세 미만 아동의 개인정보 보호를 위해 다음의 조치를 취합니다.</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>만 14세 미만 아동의 회원가입 시 법정대리인의 동의를 요구합니다.</li>
            <li>만 14세 미만 아동의 개인정보를 수집할 경우 법정대리인의 동의를 얻어 수집함을 원칙으로 합니다.</li>
            <li>회사는 수집한 아동의 개인정보에 대하여 법정대리인이 열람, 정정, 삭제, 처리정지 등을 요구할 경우 이를 즉시 처리합니다.</li>
          </ol>
          <p className="mt-2">회사는 법정대리인의 동의를 얻기 위하여 아동으로부터 법정대리인의 성명, 연락처등을 수집할 수 있습니다. 이 경우 수집한 정보는 법정대리인의 동의 여부를 확인하는 목적으로만 사용합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제9조 (정보주체와 법정대리인의 권리·의무 및 행사방법)</h2>
          <p className="mb-2">정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
          <p className="mb-2">제1항에 따른 권리 행사는 회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</p>
          <p className="mb-2">제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 &quot;개인정보 처리 방법에 관한 고시(제2020-7호)&quot; 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>
          <p className="mb-2">개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한될 수 있습니다.</p>
          <p className="mb-2">개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</p>
          <p className="mb-2">회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제10조 (쿠키 및 로컬 스토리지 사용)</h2>
          <p className="mb-2">회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &apos;쿠키(cookie)&apos;와 &apos;로컬 스토리지(local storage)&apos;를 사용합니다.</p>
          <p className="mb-2">쿠키 및 로컬 스토리지는 웹사이트가 이용자의 컴퓨터 브라우저(Chrome, Safari 등)로 전송하는 소량의 정보입니다. 회사는 로그인 시 토큰을 로컬 스토리지에 저장하여 활용합니다.</p>
          <p className="mb-2">이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
          <p className="mb-2">쿠키 설정 거부 방법</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Chrome: 설정 {'->'} 개인정보 및 보안 {'->'} 쿠키 및 기타 사이트 데이터</li>
            <li>Internet Explorer: 도구 {'->'} 인터넷 옵션 {'->'} 개인정보</li>
            <li>Safari: 환경설정 {'->'} 개인정보</li>
            <li>Edge: 설정 {'->'} 쿠키 및 사이트 권한</li>
          </ol>
          <p className="mt-2">다만, 쿠키 및 로컬 스토리지 설치를 거부할 경우 로그인이 필요한 일부 서비스 이용에 어려움이 있을 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제11조 (개인정보 보호책임자 및 연락처)</h2>
          <p className="mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보 주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <p className="font-medium">▶ 개인정보 보호책임자</p>
          <ul className="list-disc pl-6">
            <li>성명: 김채욱</li>
            <li>직책: 대표</li>
            <li>연락처: ollass.help@gmail.com</li>
          </ul>
          <p className="mt-2">정보주체께서는 회사의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제12조 (권익침해 구제방법)</h2>
          <p className="mb-2">정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이밖에 기타 개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청: 1301 (www.spo.go.kr)</li>
            <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
          </ol>
          <p className="mt-2">「개인정보보호법」 제35조(개인정보의 열람), 제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.</p>
          <p className="mt-2">※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기 바랍니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제13조 (추가적인 이용·제공 판단기준)</h2>
          <p className="mb-2">회사는 「개인정보 보호법」 제15조제3항 및 제17조제4항에 따라 「개인정보 보호법 시행령」 제14조의2에 따른 사항을 고려하여 정보주체의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다. 이에 따라 회사가 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서 다음과 같은 사항을 고려하였습니다.</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이 있는지 여부</li>
            <li>개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한 예측 가능성이 있는지 여부</li>
            <li>개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게 침해하는지 여부</li>
            <li>가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">제14조 (개인정보 처리방침 변경)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>이 개인정보처리방침은 2025년 02월 24일부터 적용됩니다.</li>
            <li>이전의 개인정보 처리방침은 회사 홈페이지에서 확인하실 수 있습니다.</li>
          </ol>
          <p className="mt-3 font-medium">부칙: 이 개인정보처리방침은 2025년 02월 24일부터 시행합니다.</p>
        </section>
      </div>
    </div>
  );
};

export default PravacyPolicyPage;
