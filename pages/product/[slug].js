import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

import en from '../../locales/en';
import pl from '../../locales/pl';

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, discount } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, setQty, onAdd, setShowCart } = useStateContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [availableOptions, setAvailableOptions] = useState({});

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
    setQty(1)
  };

  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;

  const handleBuyNow = () => {
    onAdd(product, qty, selectedSize);

    setShowCart(true);
  }

  useEffect(() => {
    setQty(1)
    setAvailableOptions(product.stockInfo);
  }, []);

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img src={urlFor(image && image[index])} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={i === index ? 'small-image selected-image' : 'small-image'}
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>
              (20)
            </p>
          </div>
          <h4>{t.slugDetailsTitle} : </h4>
          <p>{details}</p>
          <p className='price'>
            {/* TO DO: wide discount mean discount to be applied all of the products.  */}
            <span className={`${discount ? 'old-price' : 'product-price'}`}>zł{price}</span>
            <span className={`${discount ? 'price product-price' : 'product-price-no-discount'}`}>&nbsp;zł{discount && price - price * discount / 100}</span>
          </p>
          <div className="quantity">
            <h3>{t.quantity} :</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={availableOptions[selectedSize] > qty ? incQty : undefined}><AiOutlinePlus /></span>
            </p>
          </div>

          <div className="quantity">
            <h3>{t.selectSize} :</h3>
            <select className="quantity-desc" id="size" value={selectedSize} onChange={handleSizeChange}>
              <option value="" disabled>{t.selectSize}</option>
              <option value="S" disabled={!availableOptions['S'] || availableOptions['S'] < qty}>S</option>
              <option value="M" disabled={!availableOptions['M'] || availableOptions['M'] < qty}>M</option>
              <option value="L" disabled={!availableOptions['L'] || availableOptions['L'] < qty}>L</option>
              <option value="XL" disabled={!availableOptions['XL'] || availableOptions['XL'] < qty}>XL</option>
            </select>
          </div>

          <div className="buttons">
            <button
              type="button"
              className={`${!selectedSize ? 'disabled-button' : 'add-to-cart'}`}
              onClick={() => {
                if (selectedSize) {
                  onAdd(product, qty, selectedSize);
                }
              }}
              disabled={!selectedSize}
            >
              {t.addCart}
            </button>
            <button type="button" className={`${!selectedSize ? 'disabled-button' : 'buy-now'}`} onClick={handleBuyNow} disabled={!selectedSize}>
              {t.buyNow}
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>{t.mayLike}</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]'

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product }
  }
}

export default ProductDetails