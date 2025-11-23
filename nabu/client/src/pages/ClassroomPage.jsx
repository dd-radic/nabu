import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav'; 

// TEMPORARY MOCK CLASSROOM DATA - This data needs to be accessible by all pages 
const MOCK_ALL_CLASSROOMS = [
    { id: '1', name: 'Math 101', description: 'Algebra basics for beginners.', type: 'Classroom' },
    { id: '2', name: 'Science Club', description: 'Physics and chemistry experiments.', type: 'Classroom' },
];

const ClassroomPage = () => {
    const auth = useAuth();
    const { classroomId } = useParams(); 

    // LOOK UP CLASSROOM NAME
    const currentClassroom = MOCK_ALL_CLASSROOMS.find(
        (room) => String(room.id) === classroomId
    );
    
    const classroomName = currentClassroom 
        ? currentClassroom.name 
        : `Classroom ${classroomId}`; 

    // Use 'content' as the default active tab for this page
    const [activeTab, setActiveTab] = useState('content'); 

    // State for flashcard/quiz creation modal
    const [showAddTypeBox, setShowAddTypeBox] = useState(false);

    // Mock content for this specific classroom
    const [content, setContent] = useState([
        { id: 101, name: 'Week 1 Quiz', type: 'Quiz' },
        { id: 102, name: 'Key Terms Flashcards', type: 'Flash Card' },
    ]);

    // ====== Handlers (Simplified) ======
    
    // Toggle the "Add Flash Card / Quiz" modal
    const handleAddTypeClick = () => {
        setShowAddTypeBox(true);
    };

    const closeAddTypeBox = () => {
        setShowAddTypeBox(false);
    };

    const handleCreateContent = (type) => {
        const typeLabel = type === 'flashcard' ? 'Flash Card' : 'Quiz';
        const baseName = `New ${typeLabel}`;

        setContent((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: baseName,
                type: typeLabel,
            },
        ]);

        setShowAddTypeBox(false);
    };

    // ====== JSX ======
    return (
        <main className="dashboard-page">
            {/* Replaced the old button block with the reusable component */}
            <DashboardNav 
                initialActiveTab={activeTab} 
                onTabChange={setActiveTab} // Prop to receive tab changes
            />

            {/* CLASSROOM CONTENT */}
            {activeTab === 'content' && (
                <section className="dashboard-box">
                    <div className="dashboard-box-header">
                        <h2>{classroomName} Content</h2> 
                    </div>

                    {content.length === 0 ? (
                        <p>No content in this classroom yet. Click the + button to add a Flash Card or Quiz.</p>
                    ) : (
                        <div className="classroom-grid">
                            {content.map((item) => (
                                <article key={item.id} className="classroom-card">
                                    <h3>{item.name}</h3>
                                    <p className="classroom-type">
                                        Type: {item.type}
                                    </p>
                                    <p className="classroom-description">
                                        Click to view/edit this {item.type.toLowerCase()}.
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                    
                    {/* Floating + button for Flash Card / Quiz */}
                    <button
                        type="button"
                        className="floating-add-btn"
                        onClick={handleAddTypeClick}
                    >
                        +
                    </button>

                    {/* Add Type Selection Box (Modal for Flash Card/Quiz) */}
                    {showAddTypeBox && (
                        <div className="add-type-overlay" onClick={closeAddTypeBox}>
                            <div
                                className="add-type-modal"
                                onClick={(e) => e.stopPropagation()} 
                            >
                                <div className="add-type-header">
                                    <h3>Select Content Type</h3>
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
                                        onClick={() => handleCreateContent('flashcard')}
                                    >
                                        <h4>Flash Card</h4>
                                        <p>Create a flash card set for reviewing terms.</p>
                                    </button>

                                    <button
                                        type="button"
                                        className="add-type-card"
                                        onClick={() => handleCreateContent('quiz')}
                                    >
                                        <h4>Quiz</h4>
                                        <p>Create a multiple-choice or short-answer quiz.</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    <p><strong>Username:</strong> {auth.user || 'Loading...'}</p>
                    <p><strong>Email:</strong> {auth.email || 'N/A'}</p>
                    <p><strong>Role:</strong> Student</p>
                </section>
            )}
        </main>
    );
};

export default ClassroomPage;