import React, { useEffect, useState } from 'react'
import { generateTag } from '../../utils/customFunctions'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css'

function ProductImages({ data, index }) {

    const [isCarousel, setIsCarousel] = useState(window.innerWidth <= 700)

    useEffect(() => {
        function handleResize() {
            setIsCarousel(window.innerWidth <= 700)
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [window])

    function createCarousel() {
        if (!isCarousel) {
            return <>
                <img
                    className='product-image'
                    style={{ width: '100%' }}
                    src={`${import.meta.env.VITE_APP_UPLOAD_URL}${data?.[index]?.attributes.mainImage.data.attributes.formats.large.url}`}
                    alt="" />
                {data?.[index]?.attributes.images?.data.map((image, i) => {
                    if (data?.[index]?.attributes.images?.data.length % 2 === 1 && i === 2) {
                        return <img
                            key={image.id}
                            className='product-image'
                            style={{ width: '100%' }}
                            src={`${import.meta.env.VITE_APP_UPLOAD_URL}${image.attributes.formats.large.url}`} alt="" />
                    }
                    else return <img
                        key={image.id}
                        className='product-image'
                        src={`${import.meta.env.VITE_APP_UPLOAD_URL}${image.attributes.formats.large.url}`} alt="" />
                }
                )}
            </>
        }
        else return <Swiper
            slidesPerView={1}
            spaceBetween={0}
            modules={[Pagination]}
            pagination={{
                clickable: true
            }}
        >
            <SwiperSlide
                key={0}
                className='product-swiper'>
                <div className='product-card'>
                    <img src={`${import.meta.env.VITE_APP_UPLOAD_URL}${data?.[index]?.attributes.mainImage.data.attributes.formats.medium.url}`} alt="" />
                </div>
            </SwiperSlide>
            {data?.[index]?.attributes.images?.data.map(image => (
                <SwiperSlide
                    key={image.id}
                    className='product-swiper'>
                    <div className='product-card'>
                        <img src={`${import.meta.env.VITE_APP_UPLOAD_URL}${image.attributes.formats.medium.url}`} alt="" />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>

    }
    return (
        <>
            {generateTag(data?.[index]?.attributes.price, data?.[index]?.attributes.salePrice, data?.[index]?.attributes.tag)}
            {createCarousel()}
        </>

    )
}

export default ProductImages