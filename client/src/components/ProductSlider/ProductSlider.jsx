import React, { useContext, useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { generateTag } from '../../utils/customFunctions'
import { getSizeNumber, createColorsAvailableUrl } from '../../utils/customFunctions'
import { Context } from '../../Context'
import 'swiper/css'
import './ProductSlider.css'

function ProductSlider(props) {
    const [hovered, setHovered] = useState(false)
    const { addToCart, closeCart, colorsAvailable } = useContext(Context)

    const sizes = []
    for (const key in props.sizesAvailable) {
        if (typeof props.sizesAvailable[key] === 'boolean') {
            sizes.push(key)
        }
    }


    return (

        <div className='product-wrapper'>

            <Swiper allowTouchMove={props.allowTouchMove} slidesPerView={1} spaceBetween={0}>
                {generateTag(props.price, props.salePrice, props.tag)}

                <SwiperSlide
                    key={0}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className='product-swiper'>
                    <Link to={`/${props.url}`}>
                        <div className="product-card">
                            <img src={props.mainImageSrc} alt="" />
                        </div>
                    </Link>
                </SwiperSlide>
                {props.allowTouchMove && props.images.map((item, i) => (

                    <SwiperSlide
                        key={i + 1}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className='product-swiper'>
                        <Link to={`/${props.url}`}>
                            <div className="product-card">
                                <img src={`${import.meta.env.VITE_APP_UPLOAD_URL}${item.attributes.formats.medium.url}`} alt="" />
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}


                {/* Sizes Available Hover */}
                {
                    hovered && window.innerWidth > 1250 &&
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        className="product-sizes">
                        {sizes.map((item) => {
                            if (props.sizesAvailable[item]) {
                                return <button
                                    key={item}
                                    onClick={() => { setTimeout(() => closeCart(), 400), addToCart({ ...props.product, size: getSizeNumber(item).toString(), qty: 1 }) }}
                                    className='product-sizes__item'>{getSizeNumber(item)}</button>
                            }
                            else {
                                return <button key={item} disabled className='product-sizes__item item-disabled'>{getSizeNumber(item)}</button>
                            }
                        })}
                    </motion.div>
                }


                {/* Product Details */}
                <div className='product-details'>
                    <Link to={`/${props.url}`}>
                        <h3 className='product-details_title'>{props.name}</h3>
                    </Link>
                    {props.salePrice ?
                        <div className="product-salePrice">
                            <h4 className='product-details_price old-price'>
                                NZD {props.price.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}
                            </h4>
                            <h4 className='product-details_price' style={{ color: 'red' }}>
                                NZD {props.salePrice.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}
                            </h4>
                        </div>

                        : <h4 className='product-details_price'>
                            NZD {props.price.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}
                        </h4>
                    }
                    {colorsAvailable[createColorsAvailableUrl(props.url)] > 1 && 
                    <div className="product-colors-label">{colorsAvailable[createColorsAvailableUrl(props.url)]} Colors Available</div>}
                </div>

                

            </Swiper>
        </div>
    )
}

export default ProductSlider