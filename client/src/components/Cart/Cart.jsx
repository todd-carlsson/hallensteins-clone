import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { motion } from 'framer-motion'
import { Context } from '../../Context'
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'
import './Cart.css'
import CartItem from '../CartItem/CartItem'

function Cart() {

    const { cartItems, toggleCart, closeCart } = useContext(Context)

    const menuVariant = {
        hidden: {
            x: "100%",
            transition: {
                type: 'tween'
            }
        },
        visible: {
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    }
    const opacVariant = {
        hidden: {
            display: 'none'
        },
        visible: {
            display: 'block',
            backgroundColor: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']
        }
    }

    const shippingPrice = 6.95
    let subTotalCost = 0
    cartItems.map(item => subTotalCost += (item.attributes.salePrice * item.qty) || (item.attributes.price * item.qty))
    const totalCost = subTotalCost + shippingPrice

    let totalItems = 0
    cartItems.map(item => totalItems += item.qty)

    return ReactDOM.createPortal(
        <>
            <motion.div
                className="opac-layer"
                variants={opacVariant}
                animate={toggleCart ? "visible" : "hidden"}
                initial="hidden"
                onClick={closeCart} />
            <motion.div
                className='cart'
                variants={menuVariant}
                animate={toggleCart ? "visible" : "hidden"}
                initial="hidden"
            >
                <div data-test='cart-top-close' className="cart-top" onClick={closeCart}>
                    <MdOutlineKeyboardArrowLeft size={20} />
                    Your Cart
                </div>
                {!cartItems.length ?
                    <div className="cart-bottom_no-items">
                        <h4>There are currently no items in your cart.</h4>
                        <Link
                            to='/clothing'
                            className="cart-slider-btn"
                            onClick={closeCart}
                        >Start Shopping</Link>
                    </div>

                    : <>
                    {cartItems.map((item, i) => (
                        <CartItem
                            key={uuidv4()}
                            id={item.id}
                            dataTest={`cart-qty-button-${i}`}
                            product={item}
                            name={item.attributes.name}
                            url={item.attributes.url}
                            salePrice={item.attributes.salePrice}
                            price={item.attributes.price}
                            size={item.size}
                            qty={item.qty}
                            sizesAvailable={item.attributes.sizesAvailable[0]}
                            mainImageSrc={`${import.meta.env.VITE_APP_UPLOAD_URL}${item.attributes.mainImage.data.attributes.formats.thumbnail.url}`} />))}

                        <table className="cart-order-summary">
                            <tbody>
                                <tr>
                                    <th>{totalItems} {totalItems === 1 ? 'item' : 'items'}</th>
                                    <td>NZD {subTotalCost.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</td>
                                </tr>
                                <tr>
                                    <th>Shipping</th>
                                    <td>NZD {(shippingPrice).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <td style={{fontWeight: 600}}>NZD {(totalCost).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div onClick={() => console.log(cartItems)} className='cart-slider-btn'>Go To Checkout</div>
                    </>
                }


            </motion.div>
        </>,
        document.getElementById('shopping-cart-root')
    )
}

export default Cart