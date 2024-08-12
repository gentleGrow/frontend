'use client';
import styles from './Header.module.scss';
import InnerHeader from './InnerHeader';

const Header = () => {
  return (
    <header>
      <div className={styles.loginBar} />
      <InnerHeader />
    </header>
  );
};

export default Header;
