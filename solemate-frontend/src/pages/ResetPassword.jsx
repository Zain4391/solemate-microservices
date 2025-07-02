import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { authApi } from '../services/api';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('form');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("newPassword");
    
        try {
            // Your API returns { success: true, message: "Password reset successful!" }
            const response = await authApi.resetPassword(email, password);
            const { success, message } = response.data; // Access .data from axios response
            
            setStep('success');
            setSuccess(`${message} Redirecting to login...`);
    
            setTimeout(() => {
                navigate('/login');
            }, 2000);
    
            // Don't set setIsLoading(false) here - let it stay loading until redirect
    
        } catch (error) {
            console.log('Reset password error:', error); // Debug log
            setError(error.response?.data?.message || 'Email not found or reset failed. Please try again.');
            setIsLoading(false); // Only set loading to false on error
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50 p-8">
          <div className="w-full max-w-md">
            {/* Brand Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-stone-800 mb-2">
                <span className="text-amber-700">SOLEMATE</span>
              </h1>
              <p className="text-stone-600">Reset your password</p>
            </div>
            
            {/* Form Card */}
            <div className="card bg-white shadow-xl">
              <div className="card-body p-8">
                
                {/* CONDITIONAL RENDERING - Form Step */}
                {step === 'form' && (
                  <>
                    <h2 className="card-title text-2xl font-bold text-stone-800 mb-6 justify-center">
                      Reset Password
                    </h2>
                    <p className="text-stone-600 text-center mb-6">
                      Enter your email address and new password to reset your account.
                    </p>
                    
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <FormInput
                        type='email'
                        label='email address'
                        name='email'
                        size="w-full"
                      />
                      
                      <FormInput
                        type='password'
                        label='new password'
                        name='newPassword'
                        size="w-full"
                      />
                      
                      {/* Error Message */}
                      {error && (
                        <div className="alert alert-error">
                          <span className="text-sm">{error}</span>
                        </div>
                      )}
                      
                      {/* Submit Button with Loading State */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: '#b45309', // amber-700
                            borderColor: '#d97706',     // amber-600
                            color: 'white'
                        }}
                        className="btn w-full font-semibold py-3 mt-6 disabled:opacity-80"
                        >
                        {isLoading ? (
                            <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Resetting Password...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                     </button>
                     </form>
                  </>
                )}
    
                {/* CONDITIONAL RENDERING - Step 3: Success */}
                {step === 'success' && (
                  <>
                    <h2 className="card-title text-2xl font-bold text-stone-800 mb-6 justify-center">
                      Password Reset!
                    </h2>
                    
                    <div className="text-center">
                      <div className="text-6xl mb-4">✅</div>
                      <div className="alert alert-success mb-6">
                        <span>{success}</span>
                      </div>
                      
                      <div className="loading loading-dots loading-lg text-amber-600"></div>
                    </div>
                  </>
                )}
    
                {/* Back to Login Link (shown on form step) */}
                {step === 'form' && (
                  <>
                    <div className="divider text-stone-400">or</div>
                    <div className="text-center">
                      <p className="text-stone-600">
                        Remember your password?
                        <Link to="/login" className="link link-primary text-amber-600 font-semibold ml-1">
                          Back to Login
                        </Link>
                      </p>
                    </div>
                  </>
                )}
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
      )
}

export default ResetPassword
