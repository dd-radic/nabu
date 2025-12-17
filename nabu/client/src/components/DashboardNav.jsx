import React from 'react';
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable Navigation
 * @param {string} initialActiveTab
 * @param {function} onTabChange
 * @param {boolean} showBackButton - If true, shows "Back" instead of "Dashboard" logic
 */
const DashboardNav = ({ initialActiveTab, onTabChange, showBackButton = false }) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    const handleLogout = () => {
        auth.logOut();
        navigate('/'); 
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (onTabChange) {
            onTabChange(tabName);
        }
    };

    return (
        <div className="dashboard-row">
            {/* LOGIC: If we are deep inside a page (like Quiz), show BACK. Else show DASHBOARD. */}
            {showBackButton ? (
                <button
                    className="dashboard-tab"
                    onClick={() => navigate(-1)} // Go back one step in history
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

            <button
                className="dashboard-tab"
                type="button"
                onClick={() => navigate('/dashboard')} 
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