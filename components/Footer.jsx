import React from 'react';
import { useRouter } from 'next/router';
import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';

import en from '../locales/en';
import pl from '../locales/pl';

const Footer = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;

  return (
    <div className="rights-container">
      <p>{t.rights}</p>
    </div>
  )
}

export default Footer