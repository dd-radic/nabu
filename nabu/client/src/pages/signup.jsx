import React, { useState } from 'react';

/**
 * This is the Signup Page component.
 * It renders the registration form.
 */
const Signup = () => {
  // 'data' holds the info from the form
  const [data, setData] = useState({ username: '', email: '', password: '' });

  // This function updates the 'data' state every time the user types
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // This function runs when the user clicks the "Submit" button
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // Send the new user data to the /api/signup endpoint
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Check for server errors
      if (!response.ok) {
        console.error(`Error signing up: ${response.status}`);
        // TODO: Show an error message to the user (e.g., "Username taken")
        return;
      }

      const result = await response.json();
      console.log('Signup successful:', result);

      // TODO: Show a success message to the user
      // Redirect them to the login page
      window.location.href = '#/login';

    } catch (err) {
      console.error('Signup failed:', err);
      // TODO: Show a network error to the user
    }
  };

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