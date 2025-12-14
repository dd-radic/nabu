import React from 'react';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const DashboardNav = ({ initialActiveTab, onTabChange, showBackButton = false }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    const handleGoHome = () => {
        // STYLE GUIDE FIX: Use navigate, not window.location
        navigate('/dashboard');
    };

    const handleLogout = () => {
        auth.logOut();
        navigate('/'); // Redirect after logout
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (onTabChange) {
            onTabChange(tabName);
        }
    };

    return (
        <div className="dashboard-row">
            {showBackButton ? (
                <button
                    className="dashboard-tab"
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            ) : (

                <button
                    className={`dashboard-tab ${activeTab === 'classrooms' || activeTab === 'content' ? 'dashboard-tab-active' : ''}`}
                    onClick={() => {
                        handleTabClick('classrooms');
                        navigate('/dashboard');
                    }}
                >
                    Dashboard
                </button>
            )}

            {/* Renamed "Home" button to avoid confusion, or kept as requested but using Navigate */}
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