import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Navigate } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard'; // Imports the new reusable card


const ClassroomPage = () => {
    const auth = useAuth();
    const { classroomId } = useParams();
    const {classrooms} = useAuth();

    // Look up the classroom name based on the URL parameter
    const currentClassroom = classrooms.find(
        (room) => String(room.id) === classroomId
    );
    
    // Sets the display name
    // Controls the main view: 'content' (default) or 'profile'
    const [activeTab, setActiveTab] = useState('content'); 

    // Controls the modal's internal state (what form to show: null, 'selectType', 'flashcard', 'quiz')
    const [creationStep, setCreationStep] = useState(null);

    // Mock data for the content (Quizzes, Flashcards) inside this specific classroom.
    // BACKEND TASK: This data should be fetched using the classroomId (e.g., GET /api/classrooms/ID/content)
    const [content, setContent] = useState([
        { id: 101, name: 'Week 1 Quiz', type: 'Quiz', summary: 'Covers linear equations.' },
        { id: 102, name: 'Key Terms Flashcards', type: 'Flash Card', summary: '15 terms for chapter 3.' },
    ]);

    // State for the data being entered into the creation forms
    const [newContentData, setNewContentData] = useState({ 
        name: '', 
        summary: '',
    });

    // ====== Content Creation Handlers ======

    // Step 1: Triggered by the Floating '+' button
    const handleAddTypeClick = () => {
        setCreationStep('selectType');
    };

    // Resets the modal and closes it
    const closeCreationModal = () => {
        setCreationStep(null);
        setNewContentData({ name: '', summary: '' }); 
    };

    // Step 2: Moves from type selection to showing the specific form
    const handleSelectType = (type) => {
        setCreationStep(type);
    };

    // Captures form input
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewContentData({ ...newContentData, [name]: value });
    };

    // Final Step: Submits the data and creates the new item
    const handleCreateContentSubmit = (e) => {
        e.preventDefault();
        
        const typeLabel = creationStep === 'flashcard' ? 'Flash Card' : 'Quiz';
        
        // TEMPORARY: Adds new item to frontend state.
        // NEXT STEP FOR BACKEND: Send POST request to /api/classrooms/classroomId/content 
        // using the newContentData here.
        setContent((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: newContentData.name,
                type: typeLabel,
                summary: newContentData.summary || 'No summary provided.',
            },
        ]);

        closeCreationModal();
    };


    // ====== Modal Rendering Helper: Handles the two-step form flow ======
    
    const renderCreationModalContent = () => {
        switch (creationStep) {
            case 'selectType':
                // Renders the buttons to choose between Flashcard or Quiz
                return (
                    <>
                        <p className="add-type-text">Choose what type of content you want to create:</p>
                        <div className="add-type-options">
                            <button type="button" className="add-type-card" onClick={() => handleSelectType('flashcard')}>
                                <h4>Flash Card</h4>
                                <p>Define terms and concepts for study.</p>
                            </button>
                            <button type="button" className="add-type-card" onClick={() => handleSelectType('quiz')}>
                                <h4>Quiz</h4>
                                <p>Create questions for assessment.</p>
                            </button>
                        </div>
                    </>
                );

            case 'flashcard':
            case 'quiz':
                // Renders the specific form based on selection ('flashcard' or 'quiz')
                const isFlashcard = creationStep === 'flashcard';
                const typeName = isFlashcard ? 'Flash Card Set' : 'Quiz';
                
                return (
                    <form onSubmit={handleCreateContentSubmit}>
                        <label>{typeName} Name:</label>
                        <input type="text" name="name" value={newContentData.name}
                            onChange={handleFormChange} required className="form-input-text" />
                        
                        <label>Summary / Description:</label>
                        <textarea name="summary" value={newContentData.summary}
                            onChange={handleFormChange} rows="2" className="form-input-text"
                            maxLength="150"
                            placeholder={isFlashcard ? "e.g., Key definitions for Chapter 1" : "e.g., Multiple choice questions on history"}
                        />

                        <button type="submit" className="dashboard-btn form-submit-btn"
                            disabled={!newContentData.name}>
                            Create {typeName}
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };


    // ====== Main JSX Structure ======
    const {token} = useAuth();
    if (!token) return <Navigate to='/'/>

    return (
        <main className="dashboard-page">
            {/* Navigation component. 'content' is the active tab for this page's context */}
            <DashboardNav 
                initialActiveTab={'content'} 
                onTabChange={setActiveTab}
            />

            {/* CLASSROOM CONTENT VIEW: Renders the list of content items */}
            {(activeTab === 'content' || activeTab === 'classrooms') && (
                <section className="dashboard-box">
                    <div className="dashboard-box-header">
                        <h2>{currentClassroom.name} Content</h2> 
                    </div>

                    {/* Check if content list is empty */}
                    {content.length === 0 ? (
                        <p>No content in this classroom yet. Click the + button to add a Flash Card or Quiz.</p>
                    ) : (
                        <div className="classroom-grid">
                            {/* Map through the content and display using ResourceCard */}
                            {content.map((item) => (
                                <ResourceCard 
                                    key={item.id}
                                    resource={item} 
                                    isClassroomLevel={false} // Tells the card to render as static content
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Floating Add Button */}
                    <button
                        type="button"
                        className="floating-add-btn"
                        onClick={handleAddTypeClick}
                    >
                        +
                    </button>

                    {/* Content Creation Modal (Appears when creationStep is set) */}
                    {creationStep && (
                        <div className="add-type-overlay" onClick={closeCreationModal}>
                            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="add-type-header">
                                    {/* Dynamic Modal Title */}
                                    <h3>
                                        {creationStep === 'selectType' && 'Select Content Type'}
                                        {creationStep === 'flashcard' && 'Create Flash Card Set'}
                                        {creationStep === 'quiz' && 'Create Quiz'}
                                    </h3>
                                    <button type="button" className="add-type-close" onClick={closeCreationModal}>
                                        ×
                                    </button>
                                </div>
                                {renderCreationModalContent()}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* PROFILE TAB View */}
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