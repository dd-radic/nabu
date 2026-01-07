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
    <div className="container header-content">
        {userdata.name} - {userdata.email}
        
    </div>
  );
};

export default ProfileBlurb;