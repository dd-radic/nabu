import React from 'react';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom'; // Import Link

/**
 * Reusable navigation component for the Dashboard and Classroom pages.
 * It manages the active tab state (Profile, Classrooms) and handles global actions like Logout.
 * @param {string} initialActiveTab - Sets the tab that should be active when the component loads (e.g., 'classrooms' or 'content').
 * @param {function} onTabChange - Callback function run when a tab is clicked.
 */
const DashboardNav = ({ initialActiveTab, onTabChange }) => {
    const auth = useAuth();
    // Manage the active tab state internally
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    // ====== Handlers ======

    const handleGoHome = () => {
        window.location.href = '/#/dashboard';
    };

    const handleLogout = () => {
        auth.logOut();
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        // Notify the parent page (Dashboard or ClassroomPage) of the change
        if (onTabChange) {
            onTabChange(tabName);
        }
    };

    // ====== JSX (The reusable button row) ======
    
    return (
        <div className="dashboard-row">
            {/* The Classrooms tab uses Link to force navigation back to the main list */}
            <Link 
                to="/dashboard"
                // Check for 'classrooms' or 'content' to keep the tab highlighted when inside a classroom
                className={`dashboard-tab ${activeTab === 'classrooms' || activeTab === 'content' ? 'dashboard-tab-active' : ''}`}
                onClick={() => handleTabClick('classrooms')} 
            >
                Classrooms
            </Link>

            <button
                className="dashboard-tab"
                type="button"
                onClick={handleGoHome}
            >
                Home
            </button>
            <button
                className={`dashboard-tab ${activeTab === 'profile' ? 'dashboard-tab-active' : ''}`}
                type="button"
                onClick={() => handleTabClick('profile')}
            >
                Profile
            </button>

            <button
                className="dashboard-tab dashboard-tab-logout"
                type="button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardNav;