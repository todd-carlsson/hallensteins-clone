import React, { useState } from 'react'
import { createColorsAvailableUrl } from './utils/customFunctions'
import useFetch from './hooks/useFetch'

const Context = React.createContext()

function ContextProvider({ children }) {

    const [cartItems, setCartItems] = useState([])
    const [toggleCart, setToggleCart] = useState(false)
    const colorsAvailable = {}

    function closeCart() {
        setToggleCart(!toggleCart)
    }

    function getAllColorsAvailable() {
        const { data } = useFetch('/products?fields=[url]')
        data?.map(item => {
            colorsAvailable[createColorsAvailableUrl(item?.attributes.url)] ? 
            colorsAvailable[createColorsAvailableUrl(item?.attributes.url)] += 1 : 
            colorsAvailable[createColorsAvailableUrl(item?.attributes.url)] = 1
        })
    }
    getAllColorsAvailable()


    function addToCart(newItem) {
        const newArr = []
        let isUpdated = false
        cartItems.map(item => {
            if (item.id === newItem.id && item.size === newItem.size) {
                newArr.push({ ...newItem, qty: newItem.qty + item.qty <= 9 ? newItem.qty + item.qty : item.qty })
                isUpdated = true
            }
            else newArr.push(item)
        })
        if (!isUpdated) newArr.push(newItem)
        setCartItems(newArr)
    }


    function removeFromCart(id, size) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id || item.size !== size))
    }

    function updateQty(id, size, qty) {
        const newArr = []
        cartItems.map(item => {
            if (item.id === id && item.size == size) {
                newArr.push({ ...item, qty: qty <= 9 ? qty : 9 })
            }
            else newArr.push(item)
        })
        setCartItems(newArr)
    }

    function updateSize(id, oldSize, newSize, qty) {
        let oldQty
        cartItems.map(item => {
            if (item.id === id && item.size === newSize) oldQty = item.qty
        })

        const newArr = []
        cartItems.map(item => {
            if (item.id === id && item.size === oldSize) {
                newArr.push({
                    ...item,
                    size: newSize,
                    qty: oldQty ? oldQty + qty <= 9 ? oldQty + qty : Math.max(oldQty, qty) : item.qty
                })
            }
            else if (item.id !== id || item.size !== newSize) newArr.push(item)
        })
        setCartItems(newArr)
    }

    function emptyCart() {
        setCartItems([])
    }
    return (
        <Context.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            emptyCart,
            toggleCart,
            setToggleCart,
            closeCart,
            updateQty,
            updateSize,
            colorsAvailable,
        }}>
            {children}
        </Context.Provider>
    )
}
export { ContextProvider, Context }