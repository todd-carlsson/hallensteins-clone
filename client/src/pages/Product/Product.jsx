import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSizeNumber } from '../../utils/customFunctions'
import { Context } from '../../Context'
import ReactMarkdown from 'react-markdown'
import Select from 'react-select'
import { selectStylesLarge, theme } from '../../utils/selectStyles'
import useFetch from '../../hooks/useFetch'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { BiSolidCheckCircle } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { generateTag, createColorsAvailableUrl, findColor } from '../../utils/customFunctions'
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel'
import './Product.css'



function Product() {
    const categoryUrl = useParams().id
    const { addToCart, closeCart, colorsAvailable } = useContext(Context)


    function createUrl() {
        return `/products?populate=*&[filters][url][$contains]=${createColorsAvailableUrl(categoryUrl)}`
    }


    const { data, loading, error } = useFetch(createUrl())

    const [index, setIndex] = useState()
    const [sizesOptions, setSizeOptions] = useState([])
    const [firstSize, setFirstSize] = useState(sizesOptions.filter(item => !item.isDisabled)[0])

    function getCurrentIndex() {
        data?.map((item, i) => {
            if (item?.attributes?.url === categoryUrl) setIndex(i)
        })
    }


    const sizes = []
    for (const key in data?.[index]?.attributes.sizesAvailable[0]) {
        if (typeof data?.[index]?.attributes.sizesAvailable[0][key] === 'boolean') {
            sizes.push(key)
        }
    }

    function getSizeOptions() {
        let options = []
        sizes.map(item => {
            if (data?.[index]?.attributes.sizesAvailable[0][item]) {
                options.push({ value: `${getSizeNumber(item)}`, label: `${getSizeNumber(item)}` })
            }
            else if (!data?.[index]?.attributes.sizesAvailable[0][item]) {
                options.push({ value: `${getSizeNumber(item)}`, label: `${getSizeNumber(item)} --- OUT OF STOCK`, isDisabled: true })
            }
        })
        setSizeOptions(options)
        setFirstSize(options.filter(item => !item.isDisabled)[0])
        setSelectedSize(options.filter(item => !item.isDisabled)[0]?.value)
    }

    useEffect(() => {
        getCurrentIndex()
        getSizeOptions()
    }, [data])

    useEffect(() => {
        getSizeOptions()
    }, [index])


    const [selectedSize, setSelectedSize] = useState(null)
    
    function changeSelectedSize(event) {
        setSelectedSize(event.value)
        setFirstSize(sizesOptions.filter(item => item.value === event.value))
    }


    return (
        <>
            <div className='product-container'>

                {error ? "Something went wrong" :
                    (loading ? <div className="custom-loader" /> :
                        <>
                            <ul className="breadcrumb-navigation">
                                <Link to='/' >
                                    <li className='breadcrumb-item'>
                                        Home <MdOutlineKeyboardArrowRight size={16} color='#999' /></li>
                                </Link>
                                <Link to='/clothing' >
                                    <li className='breadcrumb-item'>
                                        Clothing <MdOutlineKeyboardArrowRight size={16} color='#999' />
                                    </li>
                                </Link>
                                <Link to={`/clothing/${data?.[index]?.attributes.mainCategory.data.attributes.name}`}>
                                    <li className='breadcrumb-item'>
                                        {data?.[index]?.attributes.mainCategory.data.attributes.name} <MdOutlineKeyboardArrowRight size={16} color='#999' />
                                    </li>
                                </Link>
                                <Link to={`/clothing`}>
                                    <li className='breadcrumb-item'>
                                        {data?.[index]?.attributes.sub_categories.data[0].attributes.name.replace(/_/g, ' ').replace(/and/g, '&')}
                                        <MdOutlineKeyboardArrowRight size={16} color='#999' />
                                    </li>
                                </Link>
                                <li className='breadcrumb-item current-item'>
                                    {data?.[index]?.attributes.name.replace(/_/g, ' ').replace(/and/g, '&')}
                                </li>
                            </ul>

                            <div className="product-container_left">

                                {generateTag(data?.[index]?.attributes.price, data?.[index]?.attributes.salePrice, data?.[index]?.attributes.tag)}
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

                            </div>

                            <div className="product-container_right">

                                <div className="product-details">
                                    <h1 className='product-name'>{data?.[index]?.attributes.name}</h1>
                                    <div className="product-details-price">
                                        {data?.[index]?.attributes.salePrice ?
                                            <>
                                                <div className="product-originalPrice">
                                                    NZD {data?.[index]?.attributes.price.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}</div>
                                                <div className="product-sale-price">{data?.[index]?.attributes.salePrice.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}
                                                </div>
                                            </> :
                                            <div className="product-price">
                                                NZD {data?.[index]?.attributes.price.toLocaleString("en-NZ", { style: "currency", currency: "NZD" })}
                                            </div>
                                        }
                                    </div>
                                    <br />
                                    {colorsAvailable[createColorsAvailableUrl(categoryUrl)] > 1 &&
                                        <>
                                            <span className='product-colors-available'>
                                                {colorsAvailable[createColorsAvailableUrl(categoryUrl)]} Colors Available
                                            </span>
                                            <div className="product-variant_container">
                                                {data?.map((item, i) => (
                                                    <div className='product-variant'>
                                                        <img
                                                            className='product-variant-img'
                                                            title={findColor(data?.[i]?.attributes.url)}
                                                            onClick={() => { setIndex(i), window.history.replaceState("", "", `${data?.[i]?.attributes.url}`) }}
                                                            src={`${import.meta.env.VITE_APP_UPLOAD_URL}${item.attributes.mainImage.data.attributes.formats.thumbnail.url}`}
                                                            style={{ border: index === i ? '1px solid #000' : '' }} />
                                                        {index === i && <BiSolidCheckCircle className='product-check-icon' size={24} />}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    }
                                    {
                                        sizesOptions.length > 0 && firstSize &&
                                        <Select
                                            styles={selectStylesLarge}
                                            options={sizesOptions}
                                            value={firstSize}
                                            theme={theme}
                                            onChange={(e) => changeSelectedSize(e)}
                                        />
                                    }

                                    <button onClick={() => {
                                        setTimeout(() => closeCart(), 400),
                                            addToCart(selectedSize ?
                                                { ...data?.[index], size: getSizeNumber(selectedSize).toString(), qty: 1 } :
                                                { ...data?.[index], size: getSizeNumber(firstSize.value), qty: 1 }
                                            )
                                    }}
                                        data-test='add-to-bag-button'
                                        className="add-to-bag">Add to Bag</button>
                                    <ReactMarkdown className='product-about' children={data?.[index]?.attributes.about} />
                                </div>

                            </div>
                        </>
                    )}
            </div>
            {!loading && <ProductCarousel
                heading={'You Might Also Like...'}
                url={createColorsAvailableUrl(categoryUrl)}
                mainCategory={data?.[0]?.attributes.mainCategory.data.attributes.name}
                slidesPerView={4} />}
        </>
    )
}

export default Product