import './App.css'; // ⬅️ THIS LINE IS CRUCIAL FOR STYLING
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import Page Components
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Dashboard from './pages/dashboard.jsx'; 

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
    <Router>
      <AuthProvider> 
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;