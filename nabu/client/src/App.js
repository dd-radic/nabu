import './App.css'; 
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Import Page Components
import Home from './pages/home.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Dashboard from './pages/dashboard.jsx'; 
import ClassroomPage from './pages/ClassroomPage.jsx'; 

// Import Auth Provider 
import AuthProvider from './AuthProvider.js'; 

// Import Layout Component
import { Layout } from './components/Layout.jsx';

/**
 * This is the main App component.
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

            {/* Dashboard route (lists all classrooms) */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/*  NEW DYNAMIC CLASSROOM ROUTE */}
            <Route path="/classroom/:classroomId" element={<ClassroomPage />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;