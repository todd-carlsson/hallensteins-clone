import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import qs from 'qs';
import { VscSettings } from 'react-icons/vsc'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import CategoryTagList from '../../components/CategoryTagList/CategoryTagList'
import './Clothing.css'


function Clothing() {

    const categoryId = useParams().id

    //Filter Panel Selected arrays
    const [selectedSubCats, setSelectedSubCats] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
    const [selectedColor, setSelectedColor] = useState([])

    //For sorting the data
    const [sortOption, setSortOption] = useState('relevance')

    //For Unchecking a Category Tag Item
    const [lastUnChecked, setLastUnChecked] = useState({ name: null, id: null })

    //For updating the product grid's grid template columns
    const [categoryGrid, setCategoryGrid] = useState('large')

    //For hiding and showing all filter panels
    const [isFilterHidden, setIsFilterHidden] = useState(false)

    //For opening and closing the sorting options
    const [isSortOptionsOpen, setIsSortOptionsOpen] = useState(false)


    useEffect(() => {
        setSelectedSubCats([])
        setSelectedPriceRanges([])
        setSelectedColor([])
        setActiveIndex(null)
        setPaginationCount(9)
    }, [categoryId])


    const priceListArr = []
    function priceList() {
        selectedPriceRanges.map(item => {
            priceListArr.push(
                {
                    $or: [
                        {
                            $and: [
                                { salePrice: { $notNull: true } },
                                { salePrice: { $gte: Math.min(item.min) } },
                                { salePrice: { $lte: Math.max(item.max) } },
                            ],
                        },
                        {
                            $and: [
                                { salePrice: { $null: true } },
                                { price: { $gte: Math.min(item.min) } },
                                { price: { $lte: Math.max(item.max) } },
                            ],
                        },
                    ]
                }

            )
        })
    }
    priceList()

    const priceQuery = qs.stringify(
        {
            filters: {
                $or: priceListArr,
            },
        },
        {
            encodeValuesOnly: true,
        }
    );

    function createUrl() {

        return `/products?populate=*${categoryId ? `&[filters][mainCategory][name]=${categoryId}` : ''
            }${selectedColor.length ? selectedColor.map(
                (item) => `&[filters][color][$eq]=${item}`).join('') : ''
            }${selectedSubCats.length ? selectedSubCats.map(
                (item) => `&[filters][${categoryId ? 'sub_categories' : 'mainCategory'}][name]=${item}`).join('') : ''
            }&${selectedPriceRanges.length ? priceQuery : ''
            }&${sortOption === 'lowest' || sortOption === 'highest' ? `customsort=${sortOption}` : ''
            }${sortOption === 'alphabetical' ? '&sort=name:asc' : ''}`
    }



    const { data, loading, error, totalAmountItems } = useFetch(createUrl());


    const [paginationCount, setPaginationCount] = useState(9)
    function updatePaginationCount() {
        if (paginationCount + 9 > totalAmountItems) setPaginationCount(null)
        else setPaginationCount(prevCount => prevCount + 9)
    }

    useEffect(() => {
        setPaginationCount(9)
    }, [data])

    //Subcategory data to send via props to the filter panels
    function subCategoryUrl() {
        if (categoryId) {
            return `/categories?filters[name][$eq]=${categoryId}`
        }
        else return '/categories'
    }

    //For opening and closing the filter panels
    const [activeIndex, setActiveIndex] = useState(null);


    //For selecting filters
    function handleSubCategoryChange (e) {
        const value = e.target.value;
        const isChecked = e.target.checked;
        setSelectedSubCats(
            isChecked ? [...selectedSubCats, value]
                : selectedSubCats.filter((item) => item !== value))
    };

    function handleColorChange (e) {
        const value = e.target.value;
        const isChecked = e.target.checked;
        setSelectedColor(
            isChecked ? [...selectedColor, value]
                : selectedColor.filter((item) => item !== value))
    };

    function handlePriceRangeChange (e, min, max, name) {
        const isChecked = e.target.checked
        setSelectedPriceRanges(
            isChecked ? [...selectedPriceRanges, { min: min, max: max, name: name }]
                : selectedPriceRanges.filter(item => item.min !== min && item.max !== max)
        )
    };

    //Display the selected sort option correctly to the user
    function displaySortOption() {
        if(sortOption === 'lowest') return 'Price (Lowest)'
        else if(sortOption === 'highest') return 'Price (Highest)'
        else if(sortOption === 'alphabetical') return 'A - Z'
        else return sortOption
    }

    return (
        <section className='products'>

            <div
                style={{ marginBottom: isFilterHidden ? '2rem' : '0' }}
                className="category-refine">
                <div className="category-refine__left">
                    <h3>{categoryId ? categoryId.toUpperCase() : 'ALL PRODUCTS'}</h3>
                    <div
                        onClick={() => { setIsFilterHidden(!isFilterHidden), setActiveIndex(null) }}
                        className="category-filter-toggle">
                        <VscSettings size={25} style={{ transform: 'scaleX(1.25) scaleY(0.85) rotate(90deg)' }} />
                        {isFilterHidden ? 'Show Filters' : 'Hide Filters'}
                    </div>
                </div>
                <p>{totalAmountItems} {totalAmountItems === 1 ? 'Style' : 'Styles'}</p>
                <div className="category-refine__right">
                    <div className="category-grid-control">
                        <button
                            onClick={() => setCategoryGrid('small')}
                            className="category-grid-toggle">
                            <span className={`grid-block ${categoryGrid === 'small' ? 'block-selected' : ''}`} />
                            <span className={`grid-block ${categoryGrid === 'small' ? 'block-selected' : ''}`} />
                            <span className={`grid-block ${categoryGrid === 'small' ? 'block-selected' : ''}`} />
                            <span className={`grid-block ${categoryGrid === 'small' ? 'block-selected' : ''}`} />
                        </button>
                        <button
                            onClick={() => setCategoryGrid('large')}
                            className="category-grid-toggle">
                            <span className={`grid-block ${categoryGrid === 'large' ? 'block-selected' : ''}`} />
                            <span className={`grid-block ${categoryGrid === 'large' ? 'block-selected' : ''}`} />
                            <span className={`grid-block ${categoryGrid === 'large' ? 'block-selected' : ''}`} />
                        </button>
                    </div>
                    <div className="category-sort">
                        <button onClick={() => setIsSortOptionsOpen(!isSortOptionsOpen)} className="category-sort-button">
                            Sort By <span className="category-sort-selected">
                                {displaySortOption()}
                                </span>
                            {isSortOptionsOpen ? <MdKeyboardArrowUp size={23} /> : <MdKeyboardArrowDown size={23} />}
                        </button>
                        <div
                            style={{ display: isSortOptionsOpen ? 'block' : 'none' }}
                            className="category-sort-options">
                            <ul onClick={() => setIsSortOptionsOpen(false)} className="sort-options">
                                <li
                                    onClick={() => setSortOption('relevance')}
                                    className={`sort-option ${sortOption === 'relevance' && 'is-active'}`}>Relevance</li>
                                <li
                                    onClick={() => setSortOption('alphabetical')}
                                    className={`sort-option ${sortOption === 'alphabetical' && 'is-active'}`}>A - Z</li>
                                <li
                                    onClick={() => setSortOption('lowest')}
                                    className={`sort-option ${sortOption === 'lowest' && 'is-active'}`}>Price (Lowest)</li>
                                <li
                                    onClick={() => setSortOption('highest')}
                                    className={`sort-option ${sortOption === 'highest' && 'is-active'}`}>Price (Highest)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div
                style={{ display: isFilterHidden ? 'none' : 'flex' }}
                className="filter-grid">
                <FilterPanel
                    key={1}
                    type={'category'}
                    data={data}
                    loading={loading}
                    isActive={activeIndex === 1}
                    onShow={() => setActiveIndex(prevState => prevState === 1 ? null : 1)}
                    url={subCategoryUrl()}
                    selected={selectedSubCats}
                    setSelected={setSelectedSubCats}
                    selectedColor={selectedColor}
                    selectedSubCats={selectedSubCats}
                    selectedPriceRanges={selectedPriceRanges}
                    onChange={handleSubCategoryChange}
                    params={categoryId}
                    lastUnChecked={lastUnChecked} />
                <FilterPanel
                    key={2}
                    type={'price'}
                    data={data}
                    loading={loading}
                    isActive={activeIndex === 2}
                    onShow={() => setActiveIndex(prevState => prevState === 2 ? null : 2)}
                    selected={selectedPriceRanges}
                    setSelected={setSelectedPriceRanges}
                    selectedColor={selectedColor}
                    selectedSubCats={selectedSubCats}
                    selectedPriceRanges={selectedPriceRanges}
                    onChange={handlePriceRangeChange}
                    params={categoryId}
                    lastUnChecked={lastUnChecked} />
                {/* <FilterPanel
                    key={3}
                    type={'size'}
                    isActive={activeIndex === 3}
                    onShow={() => setActiveIndex(prevState => prevState === 3 ? null : 3)} /> */}
                <FilterPanel
                    key={4}
                    type={'color'}
                    data={data}
                    loading={loading}
                    isActive={activeIndex === 4}
                    onChange={handleColorChange}
                    selected={selectedColor}
                    setSelected={setSelectedColor}
                    selectedColor={selectedColor}
                    selectedSubCats={selectedSubCats}
                    selectedPriceRanges={selectedPriceRanges}
                    onShow={() => setActiveIndex(prevState => prevState === 4 ? null : 4)}
                    params={categoryId}
                    lastUnChecked={lastUnChecked} />
            </div>

            {
                selectedSubCats.length || selectedColor.length || selectedPriceRanges.length ?
                    <CategoryTagList
                        selectedSubCats={selectedSubCats}
                        setSelectedSubCats={setSelectedSubCats}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        selectedPriceRanges={selectedPriceRanges}
                        setSelectedPriceRanges={setSelectedPriceRanges}
                        setLastUnChecked={setLastUnChecked}
                    />
                    : ''
            }

            <div
                style={{ gridTemplateColumns: categoryGrid === 'large' ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr' }}
                className='product-grid'>
                {error ? "Something went wrong" :
                    (loading ? <div className="custom-loader" /> :
                        data?.slice(0, !paginationCount ? totalAmountItems : paginationCount).map(item => (
                            <ProductSlider
                                key={item.id}
                                allowTouchMove={true}
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
                        ))
                    )
                }

            </div>
            {!loading && <div className="pagination">
                <div className="pagination-label">
                    You've viewed {paginationCount ? Math.min(paginationCount, totalAmountItems) : totalAmountItems} of {totalAmountItems} items
                </div>
                <div className="pagination-meter">
                    <span
                        className="pagination-progress"
                        style={{ width: `${(paginationCount ? paginationCount < totalAmountItems ? paginationCount / totalAmountItems : 1 : 1) * 100}%` }} />
                </div>
                <button onClick={paginationCount !== null ? updatePaginationCount : undefined} className="pagination-button">Load More</button>
            </div>}
        </section>
    )
}

export default Clothing