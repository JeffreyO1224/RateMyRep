import { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import HomePage from './pages/Homepage/Homepage';
import LoginPage from './pages/LoginPage/LoginPage'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import SignupPage from './pages/SignupPage/SignupPage'
import './App.css';


function App() {

  const router = createBrowserRouter([
      {
        path: '/',
        errorElement: <ErrorPage />,
        children: [
          { 
            path: '/',
            element: <HomePage /> 
          },
          { 
            path: '/login/', 
            element: <LoginPage /> 
          },
          {
            path: '/signup',
            element: <SignupPage />
          }
        ]
      }
    ]);
  
    return <RouterProvider router={router} />;
}

export default App
