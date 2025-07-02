import { store } from "../store/index.js";
import { redirect } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice.js";

export const loginAction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
  
    try {
      const result = await store.dispatch(loginUser({ email, password }));

      if(loginUser.fulfilled.match(result)) {
        return redirect('/dashboard');
      }
      else {
        return {
          error: result.payload || 'Login failed'
        };
      }
    } catch (error) {
      return { 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };