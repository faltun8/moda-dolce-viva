import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

import en from '../locales/en';
import pl from '../locales/pl';

const Cart = () => {
  const cartRef = useRef();
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeSale, setPromoCodeSale] = useState(100);
  const [oldTotalPrice, setOldTotalPrice] = useState(0);
  const { totalPrice, setTotalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove } = useStateContext();
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : pl;
  const predefinedPromoCodes = ['MODADOLCE-15', 'MODADOLCE25', 'MODADOLCE_35', 'MODADOLCEVIVA-15', 'MODADOLCEVIVA25', 'MODADOLCEVIVA_35', 'SUMMERSALE-15', 'SUMMERSALE25', 'SUMMERSALE_35'];

  const handleCheckout = async () => {
    const stripe = await getStripe();
  
    const requestBody = {
      cartItems: cartItems,
      promoCodeSale: promoCodeSale,
    };
  
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (response.status === 500) return;
  
    const data = await response.json();
  
    toast.loading('Redirecting...');
  
    stripe.redirectToCheckout({ sessionId: data.id });
  };


  const handleInputChange = (event) => {
    setPromoCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any logic or actions with the promoCode value here
    if (predefinedPromoCodes.includes(promoCode)) {
      setPromoCodeSale(parseInt(promoCode.slice(-2), 10));
      setOldTotalPrice(totalPrice);
      setTotalPrice(totalPrice - (totalPrice * parseInt(promoCode.slice(-2), 10) / 100));
    }
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">{t.yourCart}</span>
          <span className="cart-num-items">({totalQuantities}&nbsp;
            {totalQuantities < 2 ? (
              t.item
            ) : (
              t.items
            )})</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>{t.emptycart}</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                {t.continueShopping}
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 && cartItems.sort((a, b) => a.selectedSize > b.selectedSize ? 1 : -1).sort((a, b) => a._id > b._id ? 1 : -1).map((item) => (
            <div className="product" >
              <img src={urlFor(item?.image[0])} className="cart-product-image" />
              <div className="item-desc">
                <div className="flex top">
                  <h5>{item.name}</h5>
                  <p className='price'>{item.quantity} x&nbsp;
                    {/* TO DO: wide discount mean discount to be applied all of the products.  */}
                    <span className={`${item.discount ? 'product-price' : 'product-price-no-discount'}`}>&nbsp;zł{item.discount ? item.price - item.price * item.discount / 100 : item.price}</span>
                    <span className={`${item.discount ? 'old-price' : 'product-price'}`}>&nbsp;zł{item.price}</span>
                  </p>
                  {/* <p>{item.quantity} x zł{item.price} = <strong>zł{item.quantity * item.price}</strong></p> */}
                </div>
                <div className="flex bottom">
                  <div>
                    <p className="quantity-desc">
                      <span className="minus" onClick={() => toggleCartItemQuanitity(item._id, 'dec', item.selectedSize)}>
                        <AiOutlineMinus />
                      </span>
                      <span className="num" onClick="">{item.quantity}</span>
                      <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'inc', item.selectedSize)}><AiOutlinePlus /></span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => onRemove(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
                <div className="flex-size">
                  <p>{t.size} :&nbsp;</p>
                  <p>{item.selectedSize}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            {promoCodeSale !== 100 ? (
              <div className="promo-applied">
                <p>%{promoCodeSale} discount has been applied with your promo code</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="promo">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={handleInputChange}
                />
                <input type="submit" className="promo-submit" value="Apply" />
              </form>
            )}

            <div className="total">
              <h3>{t.subtotal}:</h3>
              <p className='price'>
                <span className={`${promoCodeSale !== 100 ? 'old-price' : 'product-price'}`}>zł{promoCodeSale == 100 ? totalPrice : oldTotalPrice}</span>
                <span className={`${promoCodeSale !== 100 ? 'product-price' : 'product-price-no-discount'}`}>&nbsp;zł{totalPrice}</span>
              </p>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                {t.checkout}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart