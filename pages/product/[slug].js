import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { FaSearch } from 'react-icons/fa';
import ImageModal from '../../components/ImageModal';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

import en from '../../locales/en';
import pl from '../../locales/pl';

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, discount, rewiewCount, ratingStar } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, setQty, onAdd, setShowCart } = useStateContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [availableOptions, setAvailableOptions] = useState({});
  const [indexForImage, setIndexForImage] = useState(null);

  const handleImageClick = (i) => {
    setIndexForImage(i);
  };

  const handleCloseModal = () => {
    setIndexForImage(null);
  };

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
    console.log('product.stockInfo :', product.stockInfo);
  }, []);

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div>
            {/* Display the main image */}
            <div className="image-container">
              <img src={urlFor(image && image[index])} className="product-detail-image" onClick={() => handleImageClick(index)} />
              <div onClick={() => handleImageClick(index)} className="magnifying-glass">
                <FaSearch />
              </div>
            </div>

            {/* Display the modal if index is not null */}
            {indexForImage !== null && (
              <ImageModal imageUrl={urlFor(image && image[indexForImage])} onClose={handleCloseModal} />
            )}
          </div>
          <div className="small-images-scroll-container">
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
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              {
                Array.from({ length: ratingStar / 2 }, (_, index) => index).map((index) => (
                  <BsStarFill />
                ))}
              {(ratingStar % 2 == 1) && <BsStarHalf />}
              {Array.from({ length: (10 - ratingStar) / 2 }, (_, index) => index).map((index) => (
                <BsStar key={index + 4} />
              ))}
            </div>
            <p>
              ({rewiewCount})
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
              <option value="Universal" disabled={!availableOptions['Universal'] || availableOptions['Universal'] < qty}>Universal</option>
              <option value="S" disabled={!availableOptions['S'] || availableOptions['S'] < qty}>S</option>
              <option value="M" disabled={!availableOptions['M'] || availableOptions['M'] < qty}>M</option>
              <option value="L" disabled={!availableOptions['L'] || availableOptions['L'] < qty}>L</option>
              <option value="XL" disabled={!availableOptions['XL'] || availableOptions['XL'] < qty}>XL</option>
              <option value="S-M" disabled={!availableOptions['S_M'] || availableOptions['S_M'] < qty}>S-M</option>
              <option value="L-XL" disabled={!availableOptions['L_XL'] || availableOptions['L_XL'] < qty}>L-XL</option>
              <option value="2XL" disabled={!availableOptions['XXL'] || availableOptions['XXL'] < qty}>2XL</option>
              <option value="2XL-3XL" disabled={!availableOptions['XXL_3XL'] || availableOptions['XXL_3XL'] < qty}>2XL-3XL</option>
              <option value="3XL" disabled={!availableOptions['XXXL'] || availableOptions['XXXL'] < qty}>3XL</option>
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
    props: { products, product },
    revalidate: 100
  }
}

export default ProductDetails