import React, { useState } from 'react';
import { useRouter } from 'next/router';


import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';
import en from '../locales/en';
import pl from '../locales/pl';


const Home = ({ products, bannerData }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setFilteredProducts(products.filter((product) => {
      if (filter !== "all") {
        return product.filters?.gender === filter || product.filters?.gender === "unisex";
      } else {
        return product;
      }
    }));
  };

  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

      <div className="gender-filter">
        <span
          className={selectedFilter === 'all' ? 'selected' : ''}
          onClick={() => handleFilterClick('all')}
        >
          All Products
        </span>
        <span
          className={selectedFilter === 'male' ? 'selected' : ''}
          onClick={() => handleFilterClick('male')}
        >
          Male
        </span>
        <span
          className={selectedFilter === 'female' ? 'selected' : ''}
          onClick={() => handleFilterClick('female')}
        >
          Female
        </span>
        {/* <span
          className={selectedFilter === 'unisex' ? 'selected' : ''}
          onClick={() => handleFilterClick('unisex')}
        >
          Unisex
        </span> */}
      </div>

      {/* Highlighted products */}
      <div className="products-heading" id="scrollToSection">
        <h2>{t.heroTitle}</h2>
        <p>{t.heroDesc}</p>
      </div>
      <div className="products-container">
        {filteredProducts
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
        {filteredProducts
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