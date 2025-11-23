import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav'; 

const Dashboard = () => {
    const auth = useAuth();
    const userProfile = {
        username: auth.user || 'Loading...',
        email: auth.email || 'N/A',
        role: 'Student',
    };

    // Use 'classrooms' as the default active tab for this page
    const [activeTab, setActiveTab] = useState('classrooms'); 

    // State for the existing classrooms
    const [classrooms, setClassrooms] = useState([
        { id: '1', name: 'Math 101', description: 'Algebra basics for beginners.', type: 'Classroom' },
        { id: '2', name: 'Science Club', description: 'Physics and chemistry experiments.', type: 'Classroom' },
    ]);

    const [showAddClassroomForm, setShowAddClassroomForm] = useState(false);
    const [newClassroomData, setNewClassroomData] = useState({ name: '', description: '' });

    // ====== Handlers (Simplified) ======

    const handleAddClassroomClick = () => {
        setShowAddClassroomForm(true);
    };

    const closeAddClassroomForm = () => {
        setShowAddClassroomForm(false);
        setNewClassroomData({ name: '', description: '' });
    };

    const handleFormChange = (e) => {
        setNewClassroomData({ ...newClassroomData, [e.target.name]: e.target.value });
    };

    const handleCreateClassroomSubmit = (e) => {
        e.preventDefault();
        setClassrooms((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                name: newClassroomData.name,
                description: newClassroomData.description,
                type: 'Classroom',
            },
        ]);
        closeAddClassroomForm();
    };

    // ====== JSX ======

    return (
        <main className="dashboard-page">
            {/* 🎯 Replaced the old button block with the reusable component */}
            <DashboardNav 
                initialActiveTab={activeTab} 
                onTabChange={setActiveTab} // Prop to receive tab changes
            />

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
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
                        <p>No recent activity found. Click the + button to add your first classroom.</p> 
                    ) : (
                        <div className="classroom-grid">
                            {classrooms.map((room) => (
                                <Link to={`/classroom/${room.id}`} key={room.id} className="classroom-card classroom-card-link">
                                    <h3>{room.name}</h3>
                                    {room.description && (
                                        <p className="classroom-description-short">{room.description}</p> 
                                    )}
                                    <p className="classroom-type">
                                        Type: {room.type}
                                    </p>
                                </Link>
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

                    {/* Add Classroom Form Modal */}
                    {showAddClassroomForm && (
                        <div className="add-type-overlay" onClick={closeAddClassroomForm}>
                            <div
                                className="add-type-modal"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="add-type-header">
                                    <h3>Create New Classroom</h3>
                                    <button
                                        type="button"
                                        className="add-type-close"
                                        onClick={closeAddClassroomForm}
                                    >
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleCreateClassroomSubmit}>
                                    <label>Classroom Name:</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={newClassroomData.name}
                                        onChange={handleFormChange}
                                        required 
                                        className="form-input-text"
                                    />
                                    
                                    <label>Description:</label>
                                    <textarea
                                        name="description" 
                                        value={newClassroomData.description}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="form-input-text"
                                        maxLength="150"
                                    />

                                    <button 
                                        type="submit" 
                                        className="dashboard-btn form-submit-btn"
                                        disabled={!newClassroomData.name}
                                    >
                                        Create Classroom
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </main>
    );
};

export default Dashboard;