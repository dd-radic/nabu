import React from 'react'
import { useState } from 'react'

const Login = () => {
  const[data, setData] = useState({ username:'', password:'' });
  
  const changeHandler = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  }

  //Makes an API call to /api/login to log in the user
  const submitHandler = async (e) => {
    e.preventDefault(); //Prevent the page from reloading
    console.log(JSON.stringify(data));

    try{
      //This sends the API call to the server. Note that the page route MUST be the same as what is in the server
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      //ALWAYS check if (!response.ok) for errors
      if(!response.ok){
        console.error(`Error logging in: ${response.status}`);
      }

      //ALWAYS await response.json()
      const result = await response.json();
      console.log('Login successful: ', result);

      //TODO: Implement logging in a user on the front end

    }catch(err){
      console.error('Login failed: ', err);
    }
  };

  return (
    <div>
      <h1>Log In</h1>
      <form className="input-text" onSubmit={submitHandler}>
        <label>Username:</label>
        <input type="text" name="username" value={data.username} onChange={changeHandler} required/>

        <label>Password:</label>
        <input type="password" name="password" value={data.password} onChange={changeHandler} required/>

        <button name="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login