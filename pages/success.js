import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsBagCheckFill } from 'react-icons/bs';
import { useCookies } from "react-cookie"


import { useStateContext } from '../context/StateContext';
import { runFireworks } from '../lib/utils';

import en from '../locales/en';
import pl from '../locales/pl';

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities, handleCookieUpdate } = useStateContext();
  const [cookies, setCookie, removeCookie] = useCookies(["cart"])
  
  useEffect(() => {
    localStorage.clear();
    removeCookie('CartItems')
    handleCookieUpdate([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    runFireworks();
  }, []);

  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>{t.thankYou}</h2>
        <p className="email-msg">{t.checkEmail}</p>
        <p className="description">
          {t.anyQuestion}
          <a className="email" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <button type="button" width="300px" className="btn">
            {t.continueShopping}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Success