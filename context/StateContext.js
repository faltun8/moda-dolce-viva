import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCookies } from "react-cookie"


const Context = createContext();

export const StateContext = ({ children }) => {
  const [cookies, setCookie] = useCookies(["cart"])
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);



  let foundProduct;
  let index;

  const handleCookieUpdate = (newestCartItems) => {
    setCookie("CartItems", JSON.stringify(newestCartItems), {
      path: "/",
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
    })
    setCartItems(newestCartItems)
  };

  useEffect(() => {
    if (Array.isArray(cookies.CartItems) && cookies.CartItems.length > 0 && !(window.location.href.indexOf("success") > -1)) {

      handleCookieUpdate(cookies.CartItems)
      setTotalQuantities(cookies.CartItems.map(product => product.quantity).reduce((acc, curr) => acc + curr, 0));
      // product.discount ? product.price - product.price * product.discount / 100 : product.price
      setTotalPrice(cookies.CartItems.map(product => product.quantity * (product.discount ? (product.price - product.price * (product.discount ? product.discount : 0)  / 100) : product.price)).reduce((acc, curr) => acc + curr, 0));
    }

  }, []);

  const onAdd = (product, quantity, selectedSize) => {
    const checkProductInCartWithSameSize = cartItems.find((item) => item._id === product._id && item.selectedSize === selectedSize);

    setTotalPrice((prevTotalPrice) => prevTotalPrice + (product.price - product.price * (product.discount ? product.discount : 0) / 100) * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    let updatedCartItems = [];
    if (checkProductInCartWithSameSize) {
      updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id && cartProduct.selectedSize === selectedSize) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity
          }
        } else {
          return {
            ...cartProduct,
          }
        }
      })

    } else {
      product.quantity = quantity;
      product.selectedSize = selectedSize;

      updatedCartItems = [...cartItems, { ...product }]
    }
    handleCookieUpdate(updatedCartItems);

    toast.success(`${qty} ${product.name} added to the cart.`);
  }

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id && item.selectedSize === product.selectedSize);
    const newCartItems = cartItems.filter((item) => !(item._id === product._id && item.selectedSize === product.selectedSize));
    
    setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.price - foundProduct.price * (foundProduct.discount ? foundProduct.discount : 0)  / 100) * foundProduct.quantity);
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
    handleCookieUpdate(newCartItems);
  }

  const toggleCartItemQuanitity = (id, value, selectedSize) => {
    foundProduct = cartItems.find((item) => item._id === id && item.selectedSize === selectedSize)
    index = cartItems.findIndex((product) => product._id === id && product.selectedSize === selectedSize);
    const newCartItems = cartItems.filter((item) => !(item._id === id && item.selectedSize === selectedSize))

    if (value === 'inc') {
      handleCookieUpdate([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + (foundProduct.price - foundProduct.price * (foundProduct.discount ? foundProduct.discount : 0) / 100))
      setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
    } else if (value === 'dec') {
      if (foundProduct.quantity > 1) {
        handleCookieUpdate([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - (foundProduct.price - foundProduct.price * (foundProduct.discount ? foundProduct.discount : 0) / 100))
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
      }
    }
  }

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  }

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setQty,
        setTotalQuantities,
        handleCookieUpdate
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);