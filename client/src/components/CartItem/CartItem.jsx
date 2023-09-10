import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSizeNumber } from '../../utils/customFunctions'
import Select from 'react-select'
import { RxCross2 } from 'react-icons/rx'
import { Context } from '../../Context'
import { selectStylesSmall, theme } from '../../utils/selectStyles'
import './CartItem.css'

function CartItem(props) {

    const { removeFromCart, updateQty, updateSize, setToggleCart } = useContext(Context)

    const sizes = []
    for (const key in props.sizesAvailable) {
        if (typeof props.sizesAvailable[key] === 'boolean') {
            sizes.push(key)
        }
    }

    let sizesOptions = []
    sizes.map(item => {
        if(props.sizesAvailable[item]) {
            sizesOptions.push({ value: `${getSizeNumber(item)}`, label: `${getSizeNumber(item)}` })
        }
    })

    const qtysOptions = [
        { value: 1, label: 'QTY 1' },
        { value: 2, label: 'QTY 2' },
        { value: 3, label: 'QTY 3' },
        { value: 4, label: 'QTY 4' },
        { value: 5, label: 'QTY 5' },
        { value: 6, label: 'QTY 6' },
        { value: 7, label: 'QTY 7' },
        { value: 8, label: 'QTY 8' },
        { value: 9, label: 'QTY 9' }
    ]

    

    const [qtyDefaultValue, setQtyDefaultValue] = useState(qtysOptions.filter(item => item.value === props.qty))  

    useEffect(() => {
        setQtyDefaultValue(qtysOptions.filter(item => item.value === props.qty))
    },[props.qty])

    return (
        <div className='cart-item'>
            <div className="cart-item_img">
                <Link onClick={() => setToggleCart(false)} to={props.url}>
                    <img src={props.mainImageSrc} alt="" />
                </Link>
            </div>
            <div className="cart-item_details">
                <Link onClick={() => setToggleCart(false)} to={props.url} className='cart-item_title'>{props.name.substring(0, 23)}{props.name.length > 23 ? '...' : ''}</Link>
                {props.salePrice ?
                    <div className='cart_price'>
                        <span className="cart-item_salePrice">NZD {(props.salePrice * props.qty).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</span>
                        <span className="cart-item_oldPrice">was NZD {(props.price * props.qty).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</span>
                    </div>

                    : <div className="cart_price">NZD {(props.price * props.qty).toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</div>
                }
                <div className="select-wrapper">
                    <Select
                        styles={selectStylesSmall}
                        options={sizesOptions}
                        onChange={(e) => updateSize(props.id, getSizeNumber(props.size), e.value, props.qty)}
                        defaultValue={sizesOptions.filter(item => item.value === getSizeNumber(props.size).toString())}
                        theme={theme} />
                    <Select
                        styles={selectStylesSmall}
                        options={qtysOptions}
                        // menuIsOpen
                        onChange={(e) => updateQty(props.id, props.size, e.value)}
                        value={qtyDefaultValue}
                        defaultValue={qtyDefaultValue}
                        theme={theme} />
                </div>

                <span className='delete-cart-item'>
                    <RxCross2 onClick={() => removeFromCart(props.id, props.size)} size={20} />
                </span>
            </div>
        </div>
    )
}

export default CartItem