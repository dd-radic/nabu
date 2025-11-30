import React from 'react';
import { useAuth } from '../AuthProvider';
import { Navigate } from 'react-router-dom';

/**
 * This is the Home Page component.
 * It renders the main "Welcome" message and the action buttons.
 */
const Home = () => {
  const {token} = useAuth();
  if (token) return <Navigate to='/dashboard'/>

  return (
    // This main container fills the remaining screen space
    <main className="home-content-section">
      {/* This new container forces all content inside to be centered */}
      <div className="home-content-wrapper">
        <h1>
          WELCOME
          <br />
          TO NABU
        </h1>
        <p>
          Your voice. Your solution. Your community.
        </p>
        
        {/* This group holds the action buttons */}
        <div className="home-actions-group">
          {/* This is the "Sign In" button.
            It uses the ".btn-brand" class to get the gradient.
          */}
          <a href="/#/login" className="btn btn-brand">
            Sign In
          </a>
          {/* This is the "Sign Up" button.
            It uses ".btn-secondary" to be the white/outline style.
          */}
          <a href="/#/signup" className="btn btn-secondary">
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
};

export default Home;