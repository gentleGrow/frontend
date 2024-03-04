'use client';
import { signOut, useSession } from 'next-auth/react';
import Login from '../pop/login/Login';
import { useState, useEffect } from 'react';
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const session = useSession();
  const handleLogout = async () => {
    await signOut();
  };
  useEffect(() => {
    if (session.status === 'authenticated') {
      console.log(session);
      setIsLoggedIn(true);
    } else if (session.status === 'unauthenticated') {
      setIsLoggedIn(false);
    }
  }, [session.status]);
  return <div>{!isLoggedIn ? <Login /> : <button onClick={handleLogout}>Logout</button>}</div>;
}
