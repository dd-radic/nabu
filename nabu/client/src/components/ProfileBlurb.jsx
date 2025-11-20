import React from 'react';
import {useAuth} from '../AuthProvider';
//import {useState} from 'react';

const ProfileBlurb = () => {
  const {user, email} = useAuth();
  return (
    <div className="container header-content">
      {user} - {email}
    </div>
  );
};

export default ProfileBlurb;