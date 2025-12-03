import {useAuth} from '../AuthProvider';
//import {useState} from 'react';

const ProfileBlurb = () => {
  const {userdata} = useAuth();

  return (
    <div className="container header-content">
        {userdata.name} - {userdata.mail}
        
    </div>
  );
};

export default ProfileBlurb;