import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { getAllFilterItems } from '../../utils/customFunctions'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import qs from 'qs';
import './FilterPanel.css'

function FilterPanel(props) {

    const [lastChecked, setLastChecked] = useState(null)

    const [subCats, setSubCats] = useState([])
    const [priceRanges, setPriceRanges] = useState([
        { id: 0, name: '$0 - $19', min: 0, max: 19.99, qty: 0, isChecked: false },
        { id: 1, name: '$20 - $39', min: 20, max: 39.99, qty: 0, isChecked: false },
        { id: 2, name: '$40 - $59', min: 40, max: 59.99, qty: 0, isChecked: false },
        { id: 3, name: '$60+', min: 60, max: Infinity, qty: 0, isChecked: false }
    ])
    const [colors, setColors] = useState([
        { name: 'black', qty: 0, isChecked: false },
        { name: 'blue', qty: 0, isChecked: false },
        { name: 'brown', qty: 0, isChecked: false },
        { name: 'charcoal', qty: 0, isChecked: false },
        { name: 'dark_blue', qty: 0, isChecked: false },
        { name: 'gold', qty: 0, isChecked: false },
        { name: 'green', qty: 0, isChecked: false },
        { name: 'grey', qty: 0, isChecked: false },
        { name: 'khaki', qty: 0, isChecked: false },
        { name: 'light_blue', qty: 0, isChecked: false },
        { name: 'light_grey', qty: 0, isChecked: false },
        { name: 'multi', qty: 0, isChecked: false },
        { name: 'navy', qty: 0, isChecked: false },
        { name: 'orange', qty: 0, isChecked: false },
        { name: 'pink', qty: 0, isChecked: false },
        { name: 'purple', qty: 0, isChecked: false },
        { name: 'red', qty: 0, isChecked: false },
        { name: 'silver', qty: 0, isChecked: false },
        { name: 'stone', qty: 0, isChecked: false },
        { name: 'tan', qty: 0, isChecked: false },
        { name: 'white', qty: 0, isChecked: false },
        { name: 'yellow', qty: 0, isChecked: false }
    ])

    const { data: subCatData } = useFetch(props.url);

    const priceListArr = []
    function priceList() {
        props.selectedPriceRanges.map(item => {
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



    function createUrl(subCategory, price, color) {
        
        return `/products?populate=*${props.params ? `&[filters][mainCategory][name]=${props.params}` : ''
            }${color ? props.selectedColor.map(
                (item) => `&[filters][color][$eq]=${item}`
            ).join('') : ''}${subCategory ? props.selectedSubCats.map(
                (item) => `&[filters][${props.params ? 'sub_categories' : 'mainCategory'}][name]=${item}`).join('') : ''
            }${price ? `&${priceQuery}` : ''}`
    }


    let { data } = useFetch(createUrl(
        //lastChecked === 'color' || lastChecked === 'price'
        lastChecked !== 'category',
        //lastChecked === 'category' || lastChecked === 'color'
        lastChecked !== 'price',
        //lastChecked === 'category' || lastChecked === 'price'
        lastChecked !== 'color'
    ))


    const { subCatArr, colorArr, priceRangeArr } = getAllFilterItems(data, props.params)



    function checkSubCat(item, checked) {
        const newArr = []
        subCats?.map(subCat => {
            if (subCat?.name === item) newArr.push({ ...subCat, isChecked: checked })
            else newArr.push(subCat)
        })
        setSubCats(newArr)
    }

    function checkColor(item, checked) {
        const newArr = []
        colors?.map(color => {
            if (color?.name === item) newArr.push({ ...color, isChecked: checked })
            else newArr.push(color)
        })
        setColors(newArr)
    }

    function checkPriceRange(id, checked) {
        const newArr = []
        priceRanges?.map(price => {
            if (price?.id === id) newArr.push({ ...price, isChecked: checked })
            else newArr.push(price)
        })
        setPriceRanges(newArr)
        // console.log(priceRanges)
    }

    function getSubcats() {
        let newArr = []
        subCatData?.map(item => {
            if (props.params) {
                item?.attributes.subCategory.map(subCat => {

                    let obj = { name: 'name', qty: 0, isChecked: false }
                    obj.name = subCat
                    newArr.push(obj)
                })
            }
            else {
                let obj = { name: 'name', qty: 0, isChecked: false }
                obj.name = item.attributes.name
                newArr.push(obj)
            }
        })

        newArr.map(item => {
            subCatArr.map(subCat => {
                if (item.name === subCat) item.qty += 1
            })
            subCats.length && subCats.map(sub => {
                if (item.name === sub.name && sub.isChecked) item.isChecked = true
            })
        })
        return setSubCats(newArr)
    }

    function getColors() {
        const newArr = []
        colors.map(item => {
            newArr.push({ ...item, qty: 0 })
        })
        newArr.map(item => (
            colorArr.map(color => {
                if (item.name === color) item.qty += 1
            })
        ))
        setColors(newArr)
    }

    function getPriceRanges() {
        const newArr = []
        priceRanges.map(item => newArr.push({ ...item, qty: 0 }))

        priceRangeArr.map(price => {
            if (price <= 19.99) newArr[0].qty += 1
            else if (price <= 39.99 && price >= 20) newArr[1].qty += 1
            else if (price <= 59.99 && price >= 40) newArr[2].qty += 1
            else if (price >= 60) newArr[3].qty += 1
        })
        setPriceRanges(newArr)
    }


    function unCheckAll() {
        const newArr = []
        if (props.type === 'category') {
            subCats?.map(subCat => {
                newArr.push({ ...subCat, isChecked: false })
            })
            setSubCats(newArr)
        }
        else if (props.type === 'price') {
            priceRanges?.map(price => {
                newArr.push({ ...price, isChecked: false })
            })
            setPriceRanges(newArr)
        }
        else if (props.type === 'color') {
            colors?.map(color => {
                newArr.push({ ...color, isChecked: false })
            })
            setColors(newArr)
        }

    }


    useEffect(() => {

        getSubcats()
        getPriceRanges()
        getColors()
    }, [data, props.data])

    useEffect(() => {
        function unCheckSelected() {
            if (props.lastUnChecked.name === 'clearAllItems') {
                setSubCats(prevState => prevState.map(item => ({ ...item, isChecked: false })))
                setPriceRanges(prevState => prevState.map(item => ({ ...item, isChecked: false })))
                setColors(prevState => prevState.map(item => ({ ...item, isChecked: false })))
            }
            else {
                setSubCats(prevState => prevState.map(item => item.name === props.lastUnChecked.name ? { ...item, isChecked: false } : item))
                setPriceRanges(prevState => prevState.map(item => item.name === props.lastUnChecked.name ? { ...item, isChecked: false } : item))
                setColors(prevState => prevState.map(item => item.name === props.lastUnChecked.name ? { ...item, isChecked: false } : item))
            }
        }
        unCheckSelected()
    }, [props.lastUnChecked])

    // useEffect(() => {
    //     props.setSelected([])
    //     setSubCats(prevState => prevState.map(item => ({ ...item, isChecked: false })))
    //     setPriceRanges(prevState => prevState.map(item => ({ ...item, isChecked: false })))
    //     setColors(prevState => prevState.map(item => ({ ...item, isChecked: false })))
    //     getSubcats()
    //     getPriceRanges()
    //     getColors()
    // }, [props.params])


    return (
        <div className='filter-panel'>

            <button
                style={{ borderBottom: props.isActive ? '#fff' : '1px solid #000' }}
                onClick={props.onShow}
                className='filter-panel_button'>
                <span className='filter-panel_type' style={{ marginLeft: props.selected.length ? 23 : '0.7rem' }}>{props.type}</span>
                {
                    props.isActive ? <AiOutlineMinus style={{ margin: '0 0.7rem' }} size={20} />
                        : <AiOutlinePlus style={{ margin: '0 0.7rem' }} size={20} />
                }

                {props.selected.length ? <div className='input-checked' /> : ''}
            </button>

            <div className='filter-item form-check' onClick={() => setLastChecked(props.type)} style={{ display: props.isActive ? 'flex' : 'none' }} >
                <div className="filter-item__selected">
                    <span className='filter-item__count'>{props.selected.length} selected</span>
                    <button
                        onClick={() => { props.setSelected([]), unCheckAll() }}
                        className="filter-item__remove">Clear</button>
                </div>

                {props.type === 'category' &&
                    subCats?.map(item => {
                        if (item?.qty > 0 || item?.isChecked) {
                            return <>
                                <input
                                    key={item?.name}
                                    checked={item?.isChecked}
                                    onChange={(e) => { props.onChange(e), checkSubCat(item?.name, e.target.checked) }}
                                    disabled={props.loading}
                                    className='css-checkbox-regular'
                                    type='checkbox'
                                    name='subCategory'
                                    id={item?.name}
                                    value={item?.name} />
                                <label htmlFor={item?.name}>{item?.name.replace(/_/g, ' ').replace(/and/g, '&')} ({item?.qty})</label>
                            </>
                        }
                    }
                    )
                }

                {props.type === 'color' &&
                    colors.map(item => {
                        if (item?.qty > 0 || item?.isChecked) {
                            return <>
                                <input
                                    key={item.id}
                                    checked={item?.isChecked}
                                    onChange={(e) => { props.onChange(e), checkColor(item.name, e.target.checked) }}
                                    disabled={props.loading}
                                    className={`css-checkbox-color ${item?.name}`}
                                    type='checkbox'
                                    name='colors'
                                    id={item.name}
                                    value={item.name} />
                                <label htmlFor={item.name}>{item.name.replace(/_/g, ' ')} ({item.qty})</label>
                            </>
                        }
                    })
                }

                {props.type === 'price' &&
                    priceRanges.map(item => {
                        if (item?.qty > 0 || item?.isChecked) {
                            return <>
                                <input
                                    key={item.id}
                                    checked={item?.isChecked}
                                    onChange={(e) => { props.onChange(e, item.min, item.max, item.name), checkPriceRange(item?.id, e.target.checked) }}
                                    disabled={props.loading}
                                    className={`css-checkbox-regular ${item?.name}`}
                                    type='checkbox'
                                    name='colors'
                                    id={item.name}
                                    value={item.name} />
                                <label htmlFor={item.name}>{item.name.replace(/_/g, ' ')} ({item.qty})</label>
                            </>
                        }
                    })
                }
            </div>

        </div>
    )
}

export default FilterPanel