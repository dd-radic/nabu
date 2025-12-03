import React, { useState } from 'react';
import {useAuth} from '../AuthProvider';
import { useEffect } from 'react';
//import {useState} from 'react';

const ProfileBlurb = () => {
  const [userdata, setUserdata] = useState([]);
  const {token} = useAuth();
   useEffect(() => {
          const fetchUserdata = async () => {
              try {
                  console.log(token);
                  const res = await fetch("http://localhost:5000/api/user", {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,  // Include the token in the request header
                  },
              });
              const data = await res.json();
              setUserdata(data);
              } catch (err) {
                  console.error("AAAAA to load AAASSADA:", err);
              }
          };
  
          fetchUserdata();
      }, [token]);
  
  return (
    <div className="container header-content">
      {userdata.name} - {userdata.mail}
    </div>
  );
};

export default ProfileBlurb;