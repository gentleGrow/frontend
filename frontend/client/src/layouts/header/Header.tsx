'use client';
import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import InnerHeader from '../innerHeader/InnerHeader';

const Header = () => {
  return (
    <header>
      <div className={styles.loginBar} />
      <InnerHeader />
    </header>
  );
};

export default Header;
