import React from 'react'
import { useState } from 'react'

const Signup = () => {
  const[data, setData] = useState({ username:'', password:'' });
    
  const changeHandler = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  }

    //Makes an API call to /api/signup to sign the user up
  const submitHandler = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if(!response.ok){
        console.error(`Error logging in: ${response.status}`);
      }

      const result = await response.json();
      console.log('Login successful: ', result);

      //TODO: Implement logging in a user on the front end

    }catch(err){
      console.error('Login failed: ', err);
    }
  };


  return (
    <div>
      <h1>Sign Up</h1>
      <form className="input-text" onSubmit={submitHandler}>
        <label>Username:</label>
        <input type="text" name="username" value={data.username} onChange={changeHandler} required/>

        <label>Password:</label>
        <input type="text" name="password" value={data.password} onChange={changeHandler} required/>

        <button name="submit">Submit</button>
      </form>
    </div>
  )
}

export default Signup