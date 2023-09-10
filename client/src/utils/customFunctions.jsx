import { LuLeaf, LuStars } from 'react-icons/lu'
import { PiTagBold } from 'react-icons/pi'
import { BsStopwatch } from 'react-icons/bs'

export function getSizeNumber(str) {
    const numbersObj = {
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10,
        "eleven": 11,
        "twelve": 12,
        "thirteen": 13,
        "twentyEight": 28,
        "thirty": 30,
        "thirtyTwo": 32,
        "thirtyFour": 34,
        "thirtySix": 36,
        "thirtyEight": 38,
        "forty": 40,
        "fortyTwo": 42
    }
    if (numbersObj[str]) return numbersObj[str]
    else return str
}

export function getAllFilterItems(data, catId) {
    const subCatArr = []
    const colorArr = []
    const priceRangeArr = []
    try {
        if (!catId) {
            data?.map(item => (
                subCatArr.push(item?.attributes.mainCategory.data.attributes.name)
            ))
        }
        else {
            data?.map(item => (
                item?.attributes.sub_categories.data.map(subCat => (
                    subCatArr.push(subCat.attributes.name)
                ))
            ))
        }

        data?.map(item => (
            colorArr.push(item?.attributes.color)
        ))

        data?.map(item => (
            item?.attributes.salePrice ? priceRangeArr.push(item?.attributes.salePrice) : priceRangeArr.push(item?.attributes.price)
        ))
    }
    catch (err) {
        console.log(err)
    }

    return { subCatArr, colorArr, priceRangeArr }
}

export function generateTag(price, salePrice, tag) {
    if (salePrice) {
        const salePercentage = Math.round((1 - (salePrice / price)) * 100).toFixed(0)
        return <span className='product-tag' style={{ color: 'red' }}>
            <PiTagBold color='black' size={17} />
            Sale (-{salePercentage}%)
        </span>
    }

    else if (tag) {
        let tagIcon
        if (tag === "New") {
            tagIcon = <LuStars size={17} />
        }
        else if (tag === "Organic") {
            tagIcon = <LuLeaf size={17} />
        }
        else if (tag === "Coming Soon") {
            tagIcon = <BsStopwatch size={17} />
        }
        return <span className='product-tag'>
            {tagIcon}{tag}
        </span>
    }
}

export function createColorsAvailableUrl(url) {
    let arr = url.split('-')
    let index
    arr.map((item, i) => {
        if (parseInt(item)) index = i
    })
    return arr.slice(0, index + 1).join('-')
}

export function findColor(url) {
    let arr = url.split('-')
    let index
    arr.map((item, i) => {
        arr[i] = arr[i][0].toUpperCase() + arr[i].substr(1)
        if (parseInt(item)) index = i
    })
    return arr.slice(index+1, arr.length).join(' ')
}