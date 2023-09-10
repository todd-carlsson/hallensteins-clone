import React from 'react'
import Carousel from '../../components/Carousel/Carousel'
import SaleGrid from '../../components/SaleGrid/SaleGrid'
import './Home.css'
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel'

function Home() {
    return (
        <>
            <Carousel />
            <SaleGrid />
            <ProductCarousel 
            heading={'Featured Products'}
            slidesPerView={4}
            />
        </>
    )
}

export default Home