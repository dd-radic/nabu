import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard'; // Imports the new reusable card

const Dashboard = () => {
    const auth = useAuth();
    
    // We use the real auth data (user, email) for the profile view
    const userProfile = {
        username: auth.user || 'Loading...',
        email: auth.email || 'N/A',
        role: 'Student', // Still hardcoded for now
    };

    // Controls which view is currently shown: Classrooms list or Profile details
    const [activeTab, setActiveTab] = useState('classrooms'); 

    // Mock data for the list of classrooms. 
    // IMPORTANT: The backend API must eventually provide this list of objects.
    const [classrooms, setClassrooms] = useState([
        { id: '1', name: 'Math 101', description: 'Algebra basics for beginners.', type: 'Classroom' },
        { id: '2', name: 'Science Club', description: 'Physics and chemistry experiments.', type: 'Classroom' },
    ]);

    // State for managing the "Create Classroom" modal visibility and form data
    const [showAddClassroomForm, setShowAddClassroomForm] = useState(false);
    const [newClassroomData, setNewClassroomData] = useState({ name: '', description: '' });

    // ====== Classroom Creation Handlers ======

    const handleAddClassroomClick = () => {
        // Opens the classroom creation modal
        setShowAddClassroomForm(true);
    };

    const closeAddClassroomForm = () => {
        // Closes the modal and resets the form data
        setShowAddClassroomForm(false);
        setNewClassroomData({ name: '', description: '' });
    };

    const handleFormChange = (e) => {
        // Captures input from the form fields
        setNewClassroomData({ ...newClassroomData, [e.target.name]: e.target.value });
    };

    const handleCreateClassroomSubmit = (e) => {
        e.preventDefault();
        
        // TEMPORARY: Adds the new classroom to the frontend state.
        // NEXT STEP FOR BACKEND: Send newClassroomData to a POST /api/classrooms endpoint here.
        setClassrooms((prev) => [
            ...prev,
            {
                id: String(Date.now()), // Unique ID for frontend navigation
                name: newClassroomData.name,
                description: newClassroomData.description,
                type: 'Classroom',
            },
        ]);
        closeAddClassroomForm();
    };

    // ====== JSX Render ======

    return (
        <main className="dashboard-page">
            {/* The shared navigation bar that controls which section is visible */}
            <DashboardNav 
                initialActiveTab={activeTab} 
                onTabChange={setActiveTab} // Updates the local 'activeTab' state
            />

            {/* Profile View: Only rendered if 'profile' tab is active */}
            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    <p><strong>Username:</strong> {userProfile.username}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Role:</strong> {userProfile.role}</p>
                </section>
            )}

            {/* Classrooms List View: Only rendered if 'classrooms' tab is active */}
            {activeTab === 'classrooms' && (
                <section className="dashboard-box">
                    <div className="dashboard-box-header">
                        <h2>My Classrooms</h2>
                    </div>

                    {/* Check if the list is empty */}
                    {classrooms.length === 0 ? (
                        <p>No recent activity found. Click the + button to add your first classroom.</p> 
                    ) : (
                        <div className="classroom-grid">
                            {/* Renders the list using the reusable ResourceCard component */}
                            {classrooms.map((room) => (
                                <ResourceCard 
                                    key={room.id}
                                    resource={room} 
                                    isClassroomLevel={true} // MUST be true for the card to act as a link
                                />
                            ))}
                        </div>
                    )}

                    {/* Floating Add Button for creating a new Classroom */}
                    <button
                        type="button"
                        className="floating-add-btn"
                        onClick={handleAddClassroomClick}
                    >
                        +
                    </button>

                    {/* Classroom Creation Form Modal */}
                    {showAddClassroomForm && (
                        <div className="add-type-overlay" onClick={closeAddClassroomForm}>
                            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="add-type-header">
                                    <h3>Create New Classroom</h3>
                                    <button type="button" className="add-type-close" onClick={closeAddClassroomForm}>
                                        ×
                                    </button>
                                </div>

                                <form onSubmit={handleCreateClassroomSubmit}>
                                    <label>Classroom Name:</label>
                                    <input type="text" name="name" value={newClassroomData.name}
                                        onChange={handleFormChange} required className="form-input-text" />
                                    
                                    <label>Description:</label>
                                    <textarea name="description" value={newClassroomData.description}
                                        onChange={handleFormChange} rows="3" className="form-input-text"
                                        maxLength="150" />

                                    <button type="submit" className="dashboard-btn form-submit-btn"
                                        disabled={!newClassroomData.name}>
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