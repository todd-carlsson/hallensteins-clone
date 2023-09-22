import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BiShoppingBag } from 'react-icons/bi'
import { IoHomeOutline } from 'react-icons/io5'
import Cart from '../Cart/Cart'
import { Context } from '../../Context'
import './Navbar.css'

function Navbar() {

    const { cartItems, closeCart } = useContext(Context)

    let totalItems = 0
    cartItems.map(item => totalItems += item.qty)
    // console.log(cartItems)

    return (
        <nav>
            <div className="navbar_wrapper">
                <div className="navbar-left">
                    <Link to="/" id='logo' title='Home' ><IoHomeOutline style={{ transform: 'scaleX(1.1)' }} size={40} /></Link>
                    <Link to="/clothing">Shop All</Link>
                    <Link to="/clothing/t-shirts">T-Shirts</Link>
                    <Link to="/clothing/shirts">Shirts</Link>
                    <Link to="/clothing/hoodies">Hoodies & Sweats</Link>
                    <Link to="/clothing/pants">Pants</Link>
                    <Link to="/clothing/jeans">Jeans</Link>
                </div>
                <div className="navbar-right">
                    <BiShoppingBag
                        size={33}
                        style={{ cursor: 'pointer' }}
                        onClick={closeCart}
                        color='black' />
                    {totalItems ? <span data-test='cart-qty-icon' onClick={closeCart} className="cart-qty">{totalItems}</span> : ''}
                </div>
            </div>
            <Cart />
        </nav>
    )
}

export default Navbar