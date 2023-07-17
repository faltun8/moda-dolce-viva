import React from 'react';
import { AiFillInstagram, AiOutlineTwitter, AiOutlineMail, AiOutlineHome } from 'react-icons/ai';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const FooterBanner = ({ footerBanner: { discount, largeText1, largeText2, saleTime, smallText, midText, desc, product, buttonText, image } }) => {
  return (
    <div className="footer-banner-container">
      <div className="banner-desc">
        <div className="right">
          <h1>CONTACT US</h1>
          <div className='contact-us-items'>
            <AiOutlineMail className='contact-us-icons'/>
            <a className='contact-us-text' href="mailto:order@example.com">  info@modadolceviva.pl</a>
          </div>
          <div className='contact-us-items'>
            <AiOutlineHome className='conact-us-icons'/>
            <span className='contact-us-text' >  8 Hickory Street West ON N2L 3H6</span>
          </div>
        </div>
        <div className="right">
          <h1>PAYMENT METHODS</h1>
          <img
            src="/payments_logo.png"
          />
        </div>
        <div className="right">
          <h1>JOIN US</h1>
          <div className="icons">
            <a href='https://www.instagram.com/modadolceviva/' target="_blank">
              <AiFillInstagram />
            </a>
            <AiOutlineTwitter />
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