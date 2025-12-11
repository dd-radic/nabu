import React from 'react';
import { useAuth } from '../AuthProvider';
import ResourceCard from '../components/ResourceCard';

/**
 * =========    COPIED FROM HOME.JSX    ===========
 * =========    FIX COMMENTS TO MATCH   ===========
 * 
 * 
 * This is the Home Page component.
 * It renders the main "Welcome" message and the action buttons.
 */
const Quiz = () => {
    const {quizdata} = useAuth();

    console.log(quizdata)

    const classroompageroute = "/#/classroom/" + quizdata.ClassRoomId;



  return (
    // This main container fills the remaining screen space
    <main className="home-content-section">
      {/* This new container forces all content inside to be centered */}
      <div className="home-content-wrapper">
        <h1>
          WELCOME
          <br />
          TO {quizdata.Title}
        </h1>
        <p>
          Your quiz. Your questions. Your Bugs.
        </p>
         <section className="dashboard-box">
                    <div className="dashboard-box-header">
                        <h2> Content</h2>
                    </div>

                   
                        <div className="classroom-grid">
                            {/* Map through the content and display using ResourceCard */}
                            <div>questions</div>
                            <div>will</div>
                            <div>go</div>
                            <div>here</div>
                        </div>
            </section>
        {/* This group holds the action buttons */}
        <div className="home-actions-group">
          {/* This is the "Sign In" button.
            It uses the ".btn-brand" class to get the gradient.
          */}
          <a href="/#/login" className="btn btn-brand">
            New Question
          </a>
          {/* This is the "Sign Up" button.
            It uses ".btn-secondary" to be the white/outline style.
          */}
          <a href={classroompageroute} className="btn btn-secondary">
            Leave
          </a>
        </div>
      </div>
    </main>
  );
};

export default Quiz;