import React, { useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'

import 'swiper/css'
import 'swiper/css/navigation';
import './Carousel.css'

function Carousel() {

    const [slide, setSlide] = useState(0)

    const data = [
        {
            img: '/images/slide1.jpg',
            btnColor: '#fff'
        },
        {
            img: '/images/slide2.jpg',
            btnColor: '#000'
        },
        {
            img: '/images/slide3.webp',
            btnColor: '#fff'
        },
        {
            img: '/images/slide5.webp',
            btnColor: '#FDED18'
        }
    ]

    const sliderStyles = {
        border: `2px solid ${data[slide].btnColor}`
    }

    const SliderButtons = () => {
        const swiper = useSwiper()
        return (
            <div className="carousel-btn">
                {data.map((item, i) => (
                    <motion.button
                        key={uuidv4()}
                        style={sliderStyles}
                        initial={{ background: slide === i ? item.btnColor : 'transparent' }}
                        whileHover={{
                            background: data[slide].btnColor
                        }}
                        onClick={() => swiper.slideTo(i)}
                    />
                ))}
            </div>
        )
    }

    const SliderArrows = () => {
        const swiper = useSwiper()
        return (
            <div className="carousel-arrows">
                <button
                    onClick={() => swiper.slidePrev()}>
                    <MdOutlineKeyboardArrowLeft className='arrow' />
                </button>
                <button onClick={() => swiper.slideNext()}>
                    <MdOutlineKeyboardArrowRight className='arrow' />
                </button>
            </div>
        )
    }

    return (
        <section className='carousel'>
            <div className="carousel-wrapper">

                <Swiper
                    className='carousel-swiper'
                    slidesPerView={1}
                    spaceBetween={20}
                    onSlideChange={(swiper) => setSlide(swiper.activeIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Navigation]}
                >
                    <SliderArrows />
                    {data.map((item, i) => (
                        <SwiperSlide key={uuidv4()}>
                            <div className="carousel-card">
                                <img src={item.img} alt="" />
                            </div>
                        </SwiperSlide>
                    ))}
                    <SliderButtons />
                </Swiper>
            </div>
        </section>
    )
}

export default Carousel