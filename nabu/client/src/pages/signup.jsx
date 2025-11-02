import React, { useState } from 'react';

const Signup = () => {
  const [data, setData] = useState({ username: '', email: '', password: '' });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Makes an API call to /api/signup to sign the user up
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Error signing up: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log('Signup successful:', result);

      alert('Signup successful! Now you can log in.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form className="input-text" onSubmit={submitHandler}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={changeHandler}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={changeHandler}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={changeHandler}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
