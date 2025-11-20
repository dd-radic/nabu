import './App.css'; // Imports the single, global stylesheet
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import Page Components
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';

// Import Auth Provider
import AuthProvider from './AuthProvider.js';

// Import Layout Component
import { Layout } from './components/Layout.jsx';

/**
 * This is the main App component.
 * Its only job is to set up the Router and define the routes.
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* The Layout component wraps all other pages.
            This makes the Navbar (which is inside Layout)
            appear on every page.
          */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;