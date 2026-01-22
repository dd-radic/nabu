import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const ProfileBlurb = () => {
  const { userdata } = useAuth();
  const navigate = useNavigate();

  if (!userdata) {
    return <div className="profile-blurb">Welcome!</div>;
  }

  return (
    <div
      className="profile-blurb"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/dashboard?tab=profile')}
    >
      <div className="avatar">
        {userdata.name?.charAt(0).toUpperCase()}
      </div>
      <span className="username">{userdata.name}</span>
    </div>
  );
};

export default ProfileBlurb;
