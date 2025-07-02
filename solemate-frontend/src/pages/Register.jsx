import React, { useEffect } from 'react'
import { Form, Link, useActionData, useNavigation } from 'react-router-dom'
import FormInput from '../components/FormInput'

const Register = () => {
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50 p-4 sm:p-6 lg:p-8 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Brand Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">
              Join <span className="text-amber-600">SOLEMATE</span>
            </h1>
            <p className="text-sm sm:text-base text-stone-600">Create your account and step into style</p>
          </div>

          {/* Registration Form Card */}
          <div className="card bg-white shadow-xl">
            <div className="card-body p-4 sm:p-6 lg:p-8">
              <h2 className="card-title text-xl sm:text-2xl font-bold text-stone-800 mb-4 lg:mb-6 justify-center">
                Create Account
              </h2>
              
              <Form method='POST' className="space-y-3 sm:space-y-4">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormInput 
                    type='text' 
                    label='first name' 
                    name='firstName'
                    size="w-full"
                  />
                  <FormInput 
                    type='text' 
                    label='last name' 
                    name='lastName'
                    size="w-full"
                  />
                </div>
                
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

                <FormInput 
                  type='password' 
                  label='confirm password' 
                  name='confirmPassword'
                  size="w-full"
                />

                {/* Phone Field */}
                <FormInput 
                  type='tel' 
                  label='phone number' 
                  name='phoneNumber'
                  size="w-full"
                />

                {/* Terms Checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2 sm:gap-3">
                    <input type="checkbox" className="checkbox checkbox-primary border-stone-300 flex-shrink-0" required />
                    <span className="label-text text-xs sm:text-sm text-stone-600 leading-relaxed">
                      I agree to the <Link to="/terms" className="link link-primary text-amber-600">Terms of Service</Link> and <Link to="/privacy" className="link link-primary text-amber-600">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Enhanced Error Message Display */}
                {actionData?.error && (
                  <div className="alert alert-error shadow-lg border-l-4 border-red-500">
                    <div className="flex-col w-full">
                      {/* Main Error */}
                      <div className="flex items-start sm:items-center mb-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-800 text-sm sm:text-base">
                            {actionData.errorType === 'NETWORK' ? 'Connection Failed' :
                            actionData.errorType === 'AUTHENTICATION' ? 'Account creation Failed' :
                            actionData.errorType === 'VALIDATION' ? 'Invalid Input' :
                            actionData.errorType === 'SERVER' ? 'Server Error' :
                            actionData.errorType === 'NAVIGATION' ? 'Navigation Error' :
                            'Registration Error'}
                          </h4>
                          <p className="text-xs sm:text-sm text-red-700">{actionData.error}</p>
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
                  className="btn w-full font-semibold py-2 sm:py-3 mt-4 lg:mt-6 hover:bg-amber-800 transition-all text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </Form>

              {/* Login Link */}
              <div className="divider text-stone-400 text-xs sm:text-sm">or</div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-stone-600">
                  Already have an account? 
                  <Link to="/login" className="link link-primary text-amber-600 font-semibold ml-1">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-4 lg:mt-6">
            <p className="text-xs sm:text-sm text-stone-500">
              © 2025 SOLEMATE. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image (Hidden on mobile/tablet, shown on desktop) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('./src/assets/image.png')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-amber-900/60 to-stone-900/40"></div>
        </div>

        {/* Content Over Image */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Step Into Excellence
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-md drop-shadow-md">
            Discover premium footwear crafted for comfort, style, and durability.
          </p>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-300">1000+</div>
              <div className="text-sm text-stone-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-300">10+</div>
              <div className="text-sm text-stone-200">Premium brands</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register