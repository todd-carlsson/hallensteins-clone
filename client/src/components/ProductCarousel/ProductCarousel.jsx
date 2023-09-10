import React from 'react'
import ProductSlider from '../ProductSlider/ProductSlider'
import useFetch from '../../hooks/useFetch'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import './ProductCarousel.css'

function ProductCarousel(props) {

    const { data, loading, error } = useFetch(
        `/products?populate=*${props.mainCategory ? `&[filters][mainCategory][name]=${props.mainCategory}` : ''
        }&[filters][url][$notContains]=${props.url}&customsort=random&pagination[start]=0&pagination[limit]=10`
    )

    return (
        <>
            {props.heading ? <h3 className='product-carousel-heading'>{props.heading}</h3> : ''}
            <Swiper
                className='product-carousel'
                breakpoints={{
                    0: {
                        slidesPerView: props.slidesPerView / 2,
                    },
                    790: {
                        slidesPerView: props.slidesPerView,
                    },
                }}
            >
                {error ? "Something went wrong" :
                    (loading ? <div className="custom-loader" /> :
                        data?.map(item => (
                            <SwiperSlide style={{ margin: '0 1rem' }}>
                                <ProductSlider
                                    key={item.id}
                                    allowTouchMove={false}
                                    url={item.attributes.url}
                                    product={item}
                                    name={item.attributes.name}
                                    salePrice={item.attributes.salePrice}
                                    price={item.attributes.price}
                                    tag={item.attributes.tag}
                                    mainImageSrc={`${import.meta.env.VITE_APP_UPLOAD_URL}${item.attributes.mainImage.data.attributes.formats.medium.url}`}
                                    images={item.attributes.images.data}
                                    sizesAvailable={item.attributes.sizesAvailable[0]}
                                />
                            </SwiperSlide>
                        ))
                    )
                }
            </Swiper>
        </>
    )
}

export default ProductCarousel