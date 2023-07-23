import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


import { urlFor } from '../lib/client';

import en from '../locales/en';
import pl from '../locales/pl';

const HeroBanner = ({ heroBanner }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;
  return (
    <div className="hero-banner-container">
      <div className="hero-banner-container-texts">
        <p className="beats-solo">{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <img src={urlFor(heroBanner.image)} alt="headphones" className="hero-banner-image" />

        <div>
          {/* <Link href='#scrollToSection'> */}
            {/* uncomment if you wanna use as a button from sanity banner */}
            {/* <button type="button">{heroBanner.buttonText}</button> */}
            {/* <button type="button">Start Shopping</button> */}
          {/* </Link> */}
          <div className="desc">
            <h5>{t.description}</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner