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
import DashboardLayout from './pages/DashboardLayout';
import ResetPassword from './pages/ResetPassword';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

/* ACTION IMPORTS */
import { loginAction } from './actions/loginAction.js';
import { registerAction } from './actions/registerAction.js';


/* LOADER IMPORTS */
import { productLoader } from './loaders/productLoader.js';
import { SingleProductLoader } from './loaders/singleProductLoader.js';

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
            path: 'profile',
            element: <Profile />,
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
    <RouterProvider router={router} />
  )
}

export default App;
