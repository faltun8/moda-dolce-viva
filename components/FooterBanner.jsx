import React from 'react';
import { AiFillInstagram, AiFillFacebook, AiOutlineMail, AiOutlineHome } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { urlFor } from '../lib/client';

import en from '../locales/en';
import pl from '../locales/pl';

const FooterBanner = ({ footerBanner: { discount, largeText1, largeText2, saleTime, smallText, midText, desc, product, buttonText, image } }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="right">
          <h1>{t.contactUs}</h1>
          <div className='contact-us-items'>
            <AiOutlineMail className='contact-us-icons'/>
            <a className='contact-us-text' href="mailto:info@modadolceviva.pl">  info@modadolceviva.pl</a>
          </div>
          <div className='contact-us-items'>
            <AiOutlineHome className='conact-us-icons'/>
            <span className='contact-us-text' >  UL. Nowt Świat 33 / 13, 00-029 Warsawa</span>
          </div>
        </div>
        <div className="right">
          <h1>{t.payMethods}</h1>
          <img
            src="/payments_logo.png"
          />
        </div>
        <div className="right">
          <h1>{t.joinUs}</h1>
          <div className="icons">
            <a href='https://www.instagram.com/modadolceviva/' target="_blank">
              <AiFillInstagram />
            </a>
            <a href='https://www.facebook.com/people/Moda-Dolce-Viva/100094467053970/' target="_blank">
              <AiFillFacebook />
            </a>
          </div>
          {/* <Link href={`/product/${product}`}>
            <button type="button">{buttonText}</button>
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default FooterBanner