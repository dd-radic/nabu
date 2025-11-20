import React from 'react';


const Dashboard = () => {
    /**
     * This is (for now) a placeholder Dashboard page
     */
  return (
    // This main container fills the remaining screen space
    <main className="home-content-section">
      {/* This new container forces all content inside to be centered */}
      <div className="home-content-wrapper">
        <h1>
          THIS IS THE D A S H B O A R D
        </h1>
        <p>
          Hey. Hi. Hello. :)
        </p>
        <p>
          heeheehoohoo
        </p>
        
        {/* This group holds the action buttons */}
        <div className="home-actions-group">
          {/* This is the "Sign In" button. It will later be the "Log Out" button
            It uses the ".btn-brand" class to get the gradient.
          */}
          <a href="/#/login" className="btn btn-brand">
            bonk
          </a>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;