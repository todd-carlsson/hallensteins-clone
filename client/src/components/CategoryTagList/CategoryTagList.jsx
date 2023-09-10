import React from 'react'
import { BsX } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import './CategoryTagList.css'

function CategoryTagList(props) {
    return (
        <ul className="category-tag-list">
            {props.selectedSubCats.map(item => (
                <li key={uuidv4()} className='category-tag'>
                    <span className="category-tag-label">{item.replace(/_/g, ' ')}</span>
                    <button
                        onClick={() => {
                            props.setSelectedSubCats(prevItems => prevItems.filter(i => i !== item)),
                            props.setLastUnChecked({ name: item, id: uuidv4() })
                        }}
                        className="category-tag-remove"><BsX size={18} /></button>
                </li>
            ))}
            {props.selectedColor.map(item => (
                <li key={uuidv4()} className='category-tag'>
                    <span className="category-tag-label">{item.replace(/_/g, ' ')}</span>
                    <button
                        onClick={() => {
                            props.setSelectedColor(prevItems => prevItems.filter(i => i !== item)),
                            props.setLastUnChecked({ name: item, id: uuidv4() })
                        }}
                        className="category-tag-remove"><BsX size={18} /></button>
                </li>
            ))}
            {props.selectedPriceRanges.map(item => (
                <li key={uuidv4()} className='category-tag'>
                    <span className="category-tag-label">{item.name.replace(/_/g, ' ')}</span>
                    <button
                        onClick={() => {
                            props.setSelectedPriceRanges(prevItems => prevItems.filter(i => i.name !== item.name)),
                            props.setLastUnChecked({ name: item.name, id: uuidv4() })
                        }}
                        className="category-tag-remove"><BsX size={18} /></button>
                </li>
            ))}

            <button
                onClick={() => {
                    props.setSelectedSubCats([]),
                        props.setSelectedColor([]),
                        props.setSelectedPriceRanges([]),
                        props.setLastUnChecked({ name: 'clearAllItems', id: uuidv4() })
                }}
                className='category-tag-reset'>Clear</button>
        </ul>
    )
}

export default CategoryTagList