import React, { useState } from 'react';
import { useAuth } from '../AuthProvider'; // ⬅️ IMPORT useAuth

const Dashboard = () => {
    // 1. GET AUTH CONTEXT DATA AND FUNCTIONS
    const auth = useAuth();
    // Use the real data from the context (user and email)
    const userProfile = {
        username: auth.user || 'Loading...', // Use real user data
        email: auth.email || 'N/A', // Use real email data
        role: 'Student', // Keep the default role for now
    };
    
    // 2. STATE AND HANDLERS (UNCHANGED/UPDATED)
    const [activeTab, setActiveTab] = useState('profile');

    const [classrooms, setClassrooms] = useState([
        { id: 1, name: 'Math 101', description: 'Algebra basics', type: 'quiz' },
        { id: 2, name: 'Science Club', description: 'Physics & experiments', type: 'flashcard' },
    ]);

    // 👇 controls whether the "Flash Card / Quiz" box is visible
    const [showAddTypeBox, setShowAddTypeBox] = useState(false);

    const handleGoHome = () => {
        window.location.href = '#/';
    };

    // 🎯 Use the real logOut function from AuthContext
    const handleLogout = () => {
        auth.logOut();
    };

    const handleAddClassroomClick = () => {
        // open the modal / box
        setShowAddTypeBox(true);
    };

    const closeAddTypeBox = () => {
        // close the modal / box
        setShowAddTypeBox(false);
    };

    const handleCreateClassroom = (type) => {
        const baseName = type === 'flashcard'
            ? 'New Flash Card Class'
            : 'New Quiz Class';

        const description = type === 'flashcard'
            ? 'Classroom for flash cards'
            : 'Classroom for quizzes';

        setClassrooms((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: baseName,
                description,
                type,
            },
        ]);

        setShowAddTypeBox(false);
    };

    // ====== JSX (UNCHANGED) ======

    return (
        <main className="dashboard-page">
            {/* Top row tabs */}
            <div className="dashboard-row">

                <button
                    className={`dashboard-tab ${activeTab === 'classrooms' ? 'dashboard-tab-active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('classrooms')}
                >
                    Classrooms
                </button>

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
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>

                <button
                    className="dashboard-tab dashboard-tab-logout"
                    type="button"
                    // 🎯 Calls the real logOut function
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    {/* Display real user data from state */}
                    <p><strong>Username:</strong> {userProfile.username}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Role:</strong> {userProfile.role}</p>
                </section>
            )}

            {/* CLASSROOM TAB */}
            {activeTab === 'classrooms' && (
                <section className="dashboard-box">
                    <div className="dashboard-box-header">
                        <h2>My Classrooms</h2>
                    </div>

                    {classrooms.length === 0 ? (
                        <p>You don’t have any classrooms yet. Click the + button to add one.</p>
                    ) : (
                        <div className="classroom-grid">
                            {classrooms.map((room) => (
                                <article key={room.id} className="classroom-card">
                                    <h3>{room.name}</h3>
                                    {room.description && (
                                        <p className="classroom-description">{room.description}</p>
                                    )}
                                    {room.type && (
                                        <p className="classroom-type">
                                            Type: {room.type === 'flashcard' ? 'Flash Card' : 'Quiz'}
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Floating + button */}
                    <button
                        type="button"
                        className="floating-add-btn"
                        onClick={handleAddClassroomClick}
                    >
                        +
                    </button>

                    {/* Add Type Selection Box (Modal) */}
                    {showAddTypeBox && (
                        <div className="add-type-overlay" onClick={closeAddTypeBox}>
                            <div
                                className="add-type-modal"
                                onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
                            >
                                <div className="add-type-header">
                                    <h3>Select Classroom Type</h3>
                                    <button
                                        type="button"
                                        className="add-type-close"
                                        onClick={closeAddTypeBox}
                                    >
                                        ×
                                    </button>
                                </div>

                                <p className="add-type-text">Choose what you want to create:</p>

                                <div className="add-type-options">
                                    <button
                                        type="button"
                                        className="add-type-card"
                                        onClick={() => handleCreateClassroom('flashcard')}
                                    >
                                        <h4>Flash Card</h4>
                                        <p>Create a classroom based on flash cards.</p>
                                    </button>

                                    <button
                                        type="button"
                                        className="add-type-card"
                                        onClick={() => handleCreateClassroom('quiz')}
                                    >
                                        <h4>Quiz</h4>
                                        <p>Create a classroom based on quizzes.</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    );
};

export default Dashboard;