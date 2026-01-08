import {useAuth} from '../AuthProvider';
//import {useState} from 'react';

const ProfileBlurb = () => {
  const {userdata} = useAuth();

  if (!userdata) {
    return (
      <div className="profile-blurb">
        <span>Welcome!</span>
      </div>
    );
  }

  
  return (
    <div className="profile-blurb">
      <div className="avatar">
        {userdata.name?.charAt(0).toUpperCase()}
      </div>
      <span className="username">{userdata.name}</span>
    </div>
  );
};

export default ProfileBlurb;