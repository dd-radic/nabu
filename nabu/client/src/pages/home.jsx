import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page-wrapper">
      
      {/* === 1. WELCOME SECTION (Top Banner) === */}
      <section className="welcome-section">
        <div className="container">
          <span className="welcome-tagline">Gamified Learning for Everyone</span>
          <h1 className="welcome-title">
            Master Your Studies <br />
            with <span className="brand-highlight">NABU</span>
          </h1>
          <p className="welcome-description">
            Create smart flashcards, take interactive quizzes, and compete with 
            classmates in real-time. Learning has never been this fun.
          </p>
          
          <div className="welcome-buttons">
            {/* Primary Action: Sign Up */}
            <Button 
                variant="primary" 
                className="welcome-cta-btn" 
                onClick={() => navigate('/signup')}
            >
                Get Started Free
            </Button>

            {/* Secondary Action: Login */}
            <Button 
                variant="outline" 
                className="welcome-cta-btn"
                onClick={() => navigate('/login')}
            >
                Log In
            </Button>
          </div>
        </div>
      </section>

      {/* === 2. FEATURES SECTION === */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why use NABU?</h2>
          <div className="features-grid">
            
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Flashcards</h3>
              <p>Create digital decks to memorize concepts fast. Perfect for vocabulary, definitions, and formulas.</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Interactive Quizzes</h3>
              <p>Test your knowledge with dynamic quizzes. Get instant feedback and track your progress.</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leaderboards</h3>
              <p>Join classrooms, compete with friends, and climb the ranks. Who will be top of the class?</p>
            </div>

          </div>
        </div>
      </section>

      {/* === 3. HOW IT WORKS SECTION === */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How it Works</h2>
          <div className="steps-row">
            
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Join a Class</h4>
              <p>Sign up and join your teacher's classroom using a simple code.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Study & Play</h4>
              <p>Review flashcards or take quizzes assigned to you.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Track Progress</h4>
              <p>See your scores improve and challenge your classmates.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;