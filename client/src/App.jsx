import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Home from './pages/Home/Home'
import Clothing from './pages/Clothing/Clothing'
import Product from './pages/Product/Product'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

import './App.css'

function App() {

  const Layout = () => {
    return (
      <>
          <Navbar />
          <Outlet />
          <Footer />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/clothing',
          element: <Clothing />
        },
        {
          path: '/clothing/:id',
          element: <Clothing />
        },
        {
          path: '/:id',
          element: <Product />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
