import './index.css'
import MainLayout from './pages/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Error from './components/Error';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './pages/DashboardLayout';
import ResetPassword from './pages/ResetPassword';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

/* ACTION IMPORTS */
import { loginAction } from './actions/loginAction.js';
import { registerAction } from './actions/registerAction.js';
import { checkoutAction } from './actions/checkoutAction.js';

/* LOADER IMPORTS */
import { productLoader } from './loaders/productLoader.js';
import { SingleProductLoader } from './loaders/singleProductLoader.js';
import { checkoutLoader } from './loaders/checkoutLoader.js';

import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import { StripeProvider } from './contexts/StripeContext.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import { paymentAction } from './actions/paymentAction.js';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import OrdersPage from './pages/OrderPage.jsx';
import { ordersLoader } from './loaders/ordersLoader.js';
import { profileLoader } from './loaders/profileLoader.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            errorElement: <Error />
          },
          {
            path: 'admin',
            element: <AdminPanel />,
            errorElement: <Error />
          }
        ]
      },
      {
        path: '/dashboard/profile',
        element: <Profile />,
        errorElement: <Error />,
        loader: profileLoader
      },
      {
        path:'/products',
        element: <ProductsPage />,
        loader: productLoader,
        errorElement: <Error />
      },
      {
        path:'/products/:id',
        element: <ProductPage />,
        loader: ({params}) => SingleProductLoader(params.id),
        errorElement: <Error />
      },
      {
        path: '/about',
        element: <AboutPage />,
        errorElement: <Error />
      },
      {
        path: '/cart',
        element: <CartPage />,
        errorElement: <Error />
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
        errorElement: <Error />,
        action: checkoutAction,
        loader: checkoutLoader
      },
      {
        path: '/payment/:orderId',
        element: <PaymentPage />,
        action: paymentAction
      },
      {
        path: '/payment-success/:orderId',
        element: <PaymentSuccessPage />
      },
      {
        path: '/orders',
        element: <OrdersPage />,
        loader: ordersLoader
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    errorElement: <Error />
  },
  {
    path: '/privacy',
    element: <Privacy />,
    errorElement: <Error />
  },
  {
    path: '/terms',
    element: <Terms />,
    errorElement: <Error />
  },
  
]);

const App = () => {
  return (
    <>
      <StripeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#78716c', // stone-500
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          // Success toasts - amber theme
          success: {
            duration: 3000,
            style: {
              background: '#d97706', // amber-600
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#d97706',
            },
          },
          // Error toasts - red theme  
          error: {
            duration: 4000,
            style: {
              background: '#dc2626', // red-600
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626',
            },
          },
          // Loading toasts
          loading: {
            style: {
              background: '#374151', // gray-700
              color: '#fff',
            },
          },
        }}
      />
      </StripeProvider>
    </>
  )
}

export default App;
