import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import {Navigate} from 'react-router-dom';

/**
 * This is the Signup Page component.
 * It renders the registration form.
 */
const Signup = () => {
  //=================== Imports ================================//
  const auth = useAuth();

  //=================== React States ===========================//
  // 'data' holds the info from the form
  const [data, setData] = useState({ username: '', email: '', password: '' });

  //================== Guards =================================//
  //Check if there is already a user. If so, redirect to dashboard
  if(auth.userdata?.id) {
    return <Navigate to="/dashboard" replace />
  }

  //=================== Handlers ==============================//
  // This function updates the 'data' state every time the user types
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // This function runs when the user clicks the "Submit" button
  const submitHandler = async (e) => {
    e.preventDefault();
    auth.signupAction(data);
  };

  //================== JSX Render ===============================//
  return (
    // This is the main container with the background image
    <div className="auth-page-container">
      {/* This is the semi-transparent form box */}
      <div className="auth-form-box">
        <h2>Welcome</h2>
        <h1>Sign Up</h1>

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

          {/* Email field */}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={data.email}
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

          {/* Submit button */}
          <button 
            type="submit"
            /* Button is disabled if any field is empty */
            disabled={!data.username || !data.email || !data.password}
          >
            Submit
          </button>
        </form>

        {/* Link to log in page */}
        <p className="signup-text">
          Already have an account? <a href="#/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;