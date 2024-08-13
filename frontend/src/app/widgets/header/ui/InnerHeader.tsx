'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './InnerHeader.module.scss';

import logo from '@/shared/assets/logo.svg';
import classNames from 'classnames';

const InnerHeader = () => {
  const router = useRouter();
  //dispatching actions
  const [search, setSearch] = useState('');

  const handleClick = () => {
    router.push('/account');
  };

  return (
    <div className={styles.innerHeader}>
      {/* <!-- 로고 --> */}
      <h1 className={styles.brand}>
        <Link href="/">
          <Image src={logo} alt="logo" width={70} height={34} priority />
        </Link>
      </h1>
      {/* <!-- GNB --> */}
      <div className={styles.typeNavigation}>
        <ul className={styles.typeNavigationList}>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>
            <Link href="/asset-management">자산관리</Link>
          </li>
        </ul>
      </div>

      {/* <!-- 검색 폼  --> */}
      <form action="/" className={styles.searchForm}>
        <fieldset>
          <div className={styles.searchFormWrapper}>
            <div className={styles.formInput}>
              <input
                type="search"
                id="searchKeyword"
                placeholder="종목명을 입력해주세요."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </fieldset>
      </form>
      {/* <!-- 알림 영역 --> */}
      <div className={styles.notify}>
        <button type="button" className={classNames(styles.button, styles.notifyButton)} />
      </div>
      {/* <!-- 회원정보 영역 --> */}
      <div className={styles.account}>
        <div className={styles.accountButtonWrapper}>
          <button type="button" onClick={handleClick} className={classNames(styles.button, styles.accountButton)} />
        </div>
      </div>
    </div>
  );
};

export default InnerHeader;
