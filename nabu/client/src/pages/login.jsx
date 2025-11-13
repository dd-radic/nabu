import React from 'react';
import { useState } from 'react';

/**
 * This is the Login Page component.
 * It renders the login form.
 */
const Login = () => {
  // 'data' holds the info from the form (username, password)
  const [data, setData] = useState({ username: '', password: '' });

  // This function updates the 'data' state every time the user types
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // This function runs when the user clicks the "Login" button
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    console.log('User attempting to log in with:', JSON.stringify(data));

    try {
      // Send the data to the /api/login endpoint on the server
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Check if the server responded with an error
      if (!response.ok) {
        console.error(`Error logging in: ${response.status}`);
        // TODO: Show an error message to the user
        return; 
      }

      // Get the JSON response from the server (e.g., user data, token)
      const result = await response.json();
      console.log('Login successful: ', result);

      // TODO: Save the user's token and redirect to a dashboard
      // Example: localStorage.setItem('token', result.token);
      // Example: window.location.href = '/#/dashboard';

    } catch (err) {
      console.error('Login failed: ', err);
      // TODO: Show a network error to the user
    }
  };

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