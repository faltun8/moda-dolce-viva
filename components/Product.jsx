import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const Product = ({ product: { image, name, slug, price, discount }, wideDiscount }) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <img
            src={urlFor(image && image[0])}
            width={250}
            height={250}
            className="product-image"
          />
          <p className="product-name">{name}</p>
          <p className='price'>
            {/* TO DO: wide discount mean discount to be applied all of the products.  */}
            <span className={`${wideDiscount || discount ? 'old-price' : 'product-price'}`}>zł{price}</span>
            <span className={`${wideDiscount || discount ? 'product-price' : 'product-price-no-discount'}`}>&nbsp;zł{wideDiscount || discount && price - price * discount / 100}</span>
          </p>
        </div>
      </Link>
    </div>
  )
}

export default Product