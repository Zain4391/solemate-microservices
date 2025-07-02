import React, { useEffect } from 'react';
import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { authApi } from '../services/api';

const Login = () => {
  const actionData = useActionData();
  const navigation = useNavigation();

  useEffect(() => {
    if (actionData?.error && navigation.state === "idle") {
      // Clear the form by resetting navigation state
      const form = document.querySelector('form');
      if (form) {
        form.reset();
      }
    }
  }, [actionData, navigation.state]);

  const isLoading = navigation.state === 'submitting';
  return (
    <div className='min-h-screen flex'>
      {/* Left Side - Login Form (50%) */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50 p-8">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              Welcome to <span className="text-amber-700">SOLEMATE</span>
            </h1>
            <p className="text-stone-600">Sign in to your account</p>
          </div>
          
          {/* Login Form Card */}
          <div className="card bg-white shadow-xl">
            <div className="card-body p-8">
              <h2 className="card-title text-2xl font-bold text-stone-800 mb-6 justify-center">
                Welcome Back!
              </h2>
              
              <Form method='POST' className="space-y-4">
                {/* Email Field */}
                <FormInput
                  type='email'
                  label='email'
                  name='email'
                  size="w-full"
                />
                
                {/* Password Field */}
                <FormInput
                  type='password'
                  label='password'
                  name='password'
                  size="w-full"
                />
                
                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link to="/reset-password" className="link link-primary text-amber-700 text-sm">
                    Forgot password?
                  </Link>
                </div>

                {/* Enhanced Error Message Display */}
                {actionData?.error && (
                  <div className="alert alert-error shadow-lg border-l-4 border-red-500">
                    <div className="flex-col w-full">
                      {/* Main Error */}
                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800">
                            {actionData.errorType === 'NETWORK' ? 'Connection Failed' :
                            actionData.errorType === 'AUTHENTICATION' ? 'Login Failed' :
                            actionData.errorType === 'VALIDATION' ? 'Invalid Input' :
                            actionData.errorType === 'SERVER' ? 'Server Error' :
                            actionData.errorType === 'NAVIGATION' ? 'Navigation Error' :
                            'Login Error'}
                          </h4>
                          <p className="text-sm text-red-700">{actionData.error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading ? '#d97706' : '#b45309', // amber-600 when loading, amber-700 when not
                    borderColor: '#d97706',     // amber-600
                    color: 'white',
                    opacity: isLoading ? 0.8 : 1
                  }}
                  className="btn w-full font-semibold py-3 mt-6 hover:bg-amber-800 transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

              </Form>
              
              {/* Register Link */}
              <div className="divider text-stone-400">or</div>
              <div className="text-center">
                <p className="text-stone-600">
                  Don't have an account?
                  <Link to="/register" className="link link-primary text-amber-700 font-semibold ml-1">
                    Sign Up!
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer Text */}
          <div className="text-center mt-6">
            <p className="text-sm text-stone-500">
              © 2025 SOLEMATE. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image (50%) */}
      {/* Right Side - Hero Image (50%) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('./src/assets/image2.png')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-amber-900/60 to-stone-900/40"></div>
        </div>

        {/* Content Over Image - PERFECTLY CENTERED */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full w-full p-8 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold drop-shadow-lg">
              Step Into Excellence
            </h2>
            <p className="text-xl text-amber-100 max-w-md drop-shadow-md">
              Quality footwear just a click away!
            </p>
            
            {/* Simple Feature List */}
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">👟</span>
                <span className="text-amber-200 font-medium text-lg">Premium Collection</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">🚚</span>
                <span className="text-amber-200 font-medium text-lg">Fast Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">⭐</span>
                <span className="text-amber-200 font-medium text-lg">Trusted Quality</span>
              </div>
            </div>

            {/* Quote */}
            <div className="text-center">
              <blockquote className="text-base italic text-amber-100 drop-shadow-md">
                "Your perfect pair is waiting for you"
              </blockquote>
              <cite className="text-sm text-stone-300 not-italic mt-1">- SOLEMATE Team</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login