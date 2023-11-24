import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { urlFor } from '../lib/client';
import en from '../locales/en';
import pl from '../locales/pl';

const HeroBanner = ({ heroBanner }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Initial call to set isMobile based on the initial screen width
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;
  

  return (
    <div className="hero-banner-container" style={{ backgroundImage: !isMobile ? `url(${urlFor(heroBanner.image)})` : `url(${urlFor(heroBanner.image_mobile)})` }}>
      <div className="hero-banner-container-texts">
        {/* <p className="beats-solo">{heroBanner.smallText}</p> */}
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        {/* <img src={urlFor(heroBanner.image)} alt="headphones" className="hero-banner-image" /> */}

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
  );
};

export default HeroBanner;