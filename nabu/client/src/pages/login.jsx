import React from 'react';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import {Navigate} from 'react-router-dom';

/**
 * This is the Login Page component.
 * It renders the login form.
 */
const Login = () => {
  //============= Imports =====================================//
  const auth = useAuth();

  //============= React States ================================//
  // 'data' holds the info from the form (username, password)
  const [data, setData] = useState({ username: '', password: '' });

  //============= Guards ======================================//
  //Check if there is already a user. If so, redirect to dashboard
  if(auth.userdata?.id) {
    return <Navigate to="/dashboard" replace />
  }

  //============= Handlers ====================================//
  // This function updates the 'data' state every time the user types
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // This function runs when the user clicks the "Login" button
  const submitHandler = (e) => {
    e.preventDefault();
    if (data.username !== "" && data.password !== "") {
      auth.loginAction(data);
      return;
    }
    alert("Please provide a valid input.");
  };

  //============= JSX Render ================================//
  return (
    // This is the main container (styled in App.css)
    <div className="auth-page-container">
      {/* This is the white form box */}
      <div className="auth-form-box">
        <h2>Welcome</h2>
        <h1>Log In</h1>

        <form className="input-text" onSubmit={submitHandler}>
          {/* Username field */}
          <label>Username:</label>
          <input 
            type="text"
            name="username"
            value={data.username}
            onChange={changeHandler}
            required 
          />

          {/* Password field */}
          <label>Password:</label>
          <input 
            type="password"
            name="password"
            value={data.password}
            onChange={changeHandler}
            placeholder="Enter your password"
            required 
          />

          {/* Submit Button */}
          <button 
            type="submit"
            /* Button is disabled if username OR password is empty */
            disabled={!data.username || !data.password}
          >
            Login
          </button>
        </form>

        {/* Link to signup page */}
        <p className="signup-text">
          Don’t have an account? <a href="#/signup">Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login;