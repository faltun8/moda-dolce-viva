import React from 'react';
import { useRouter } from 'next/router';


import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import en from '../locales/en';
import pl from '../locales/pl';


const Home = ({ products, bannerData }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      
      {/* Highlighted products */}
      <div className="products-heading">
        <h2>{t.heroTitle}</h2>
        <p>{t.heroDesc}</p>
      </div>
      <div className="products-container">
        {console.log('products :', products)}
        {products
          ?.filter((product) => product.isHighlighted === true)
          .map((product) => (
            <Product
              key={product._id}
              product={product}
              wideDiscount={bannerData.length && bannerData[0].discount}
            />
          ))}
      </div>

      {/* Not Highlighted products */}
      <div className="products-heading">
        <h2>{t.allProductTitle}</h2>
        <p>{t.allProductDesc}</p>
      </div>
      <div className="products-container">
      {products
          ?.filter((product) => product.isHighlighted === false)
          .map((product) => (
            <Product
              key={product._id}
              product={product}
              wideDiscount={bannerData.length && bannerData[0].discount}
            />
          ))}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  }
}

export default Home;