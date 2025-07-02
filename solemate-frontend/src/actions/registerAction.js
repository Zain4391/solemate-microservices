import { authApi } from "../services/api.js";
import { redirect } from "react-router-dom";

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const phoneNumber = formData.get("phoneNumber");

  // Frontend validation - Password confirmation check
  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match. Please try again.',
      errorType: 'VALIDATION'
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long.',
      errorType: 'VALIDATION'
    };
  }

  const userData = {
    firstName,
    lastName,
    email,
    password,
    phoneNumber
  }

  console.log(userData);

  try {
    const response = await authApi.register(userData);
    
    // Set token and user
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    return redirect('/login');
    
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';
    let errorType = 'SERVER';

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;
      
      if (status === 400) {
        errorType = 'VALIDATION';
        errorMessage = serverMessage || 'Invalid registration data';
      } else if (status === 409) {
        errorType = 'CONFLICT';
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (status === 500) {
        errorType = 'SERVER';
        errorMessage = `Server Error: ${serverMessage || 'Registration failed'}`;
      }
    } else if (error.request) {
      errorType = 'NETWORK';
      errorMessage = 'Network Error: Cannot connect to server';
    }

    return {
      error: errorMessage,
      errorType: errorType
    };
  }
};