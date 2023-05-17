import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineShopping } from 'react-icons/ai'

import { Cart } from './';
import { useStateContext } from '../context/StateContext';
import en from '../locales/en';
import pl from '../locales/pl';

const Navbar = () => {
    const { showCart, setShowCart, totalQuantities } = useStateContext();

    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : pl;

    const changeLanguage = (e) => {
        const locale = e.target.value;
        router.push(router.pathname, router.asPath, { locale });
    };

    return (
        <div className="navbar-container">
            <p className="logo">
                <Link href="/">Moda Dolce Viva</Link>
            </p>

            <div className='nav-right-container'>
                <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
                    <AiOutlineShopping />
                    <span className="cart-item-qty">{totalQuantities}</span>
                </button>
                <select
                    onChange={changeLanguage}
                    defaultValue={locale}
                    className="translate-icon"
                >
                    <option className="text-black" value="en">EN</option>
                    <option className="text-black" value="pl">PL</option>
                </select>
            </div>

            {showCart && <Cart />}
        </div>
    )
}

export default Navbar