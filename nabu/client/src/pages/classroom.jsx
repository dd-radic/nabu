import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Navigate } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard'; // Imports the new reusable card


const ClassroomPage = () => {
    //=============== Imports =============================================//
    const { userdata, token, 
            classrooms, addUser, removeUser, isMember, deleteClassroom, 
            loadContent, createQuiz, createFlashcard 
        } = useAuth();
    const { classroomId } = useParams();

    //=============== React States =======================================//
    // Sets the display name
    // Controls the main view: 'content' (default) or 'profile'
    const [activeTab, setActiveTab] = useState('content');

    // Controls the modal's internal state (what form to show: null, 'selectType', 'flashcard', 'quiz')
    const [creationStep, setCreationStep] = useState(null);

    // Mock data for the content (Quizzes, Flashcards) inside this specific classroom.
    // BACKEND TASK: This data should be fetched using the classroomId (e.g., GET /api/classrooms/ID/content)
    const [content, setContent] = useState([]);

    // State for the data being entered into the creation forms
    const [newContentData, setNewContentData] = useState({
        name: '',
        description: '',
    });

    const [isUserJoined, setIsUserJoined] = useState(false);

    // Look up the classroom based on the URL parameter
    const currentClassroom = classrooms.find(
        (room) => String(room.id) === classroomId
    );

    //=============== Initialization Steps ===============================//
    //Guard that returns empty content if the userdata or classroom data is not loaded in yet
    useEffect(() => {
        if (!userdata?.id && !token) return;
        if (!currentClassroom) return;

        loadContent(userdata, classroomId, setContent);
    }, [userdata, token, loadContent, currentClassroom, classroomId]);

    // Initialize whether the user has joined this classroom
    useEffect(() => {
        if (!currentClassroom) return;

        const initJoin = async () => {
            try {
                const member = await isMember(currentClassroom.id);
                setIsUserJoined(member);
            } catch (err) {
                console.error('Error checking membership:', err);
            }
        };

        initJoin();
    }, [currentClassroom, isMember]);

    //Guards to safely reroute out of classroom page if classroom or userdata not found
    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!currentClassroom) {
        console.warn("Classroom not found (probably deleted). Redirecting to dashboard.");
        return <Navigate to="/dashboard" replace />;
    }

    //=============== Modal Control ============================================//
    // Step 1: Triggered by the Floating '+' button
    const handleAddTypeClick = () => {
        setCreationStep('selectType');
    };

    // Resets the modal and closes it
    const closeCreationModal = () => {
        setCreationStep(null);
        setNewContentData({ name: '', description: '' });
    };

    //=============== Handler functions =======================================//
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
    const handleCreateContentSubmit = async (e) => {
        e.preventDefault();

        // Nur Quiz speichern (Flashcards später)
        if (creationStep === "quiz") {
            const quizPayload = {
                title: newContentData.name,
                description: newContentData.description,
                classRoomId: classroomId,
                creatorId: userdata.id
            };
            const savedQuiz = await createQuiz(quizPayload);

            if (savedQuiz) {
                setContent(prev => [
                    ...prev,
                    {
                        id: savedQuiz.Id,
                        name: savedQuiz.Title,
                        type: "Quiz",
                        summary: savedQuiz.Description || "No description"
                    }
                ]);
            }
        }
        if (creationStep === "flashcard") {
            const flashcardPayload = {
                classRoomId: classroomId,
                title: newContentData.name,
                information: newContentData.description,
                tags: "default"
            }
            const savedFC = await createFlashcard(flashcardPayload);

            if (savedFC) {
                setContent(prev => [
                    ...prev,
                    {
                        id: savedFC.id,
                        name: newContentData.name,
                        type: "Flashcard",
                        summary: newContentData.description || "Flashcard"
                    }
                ]);
            }
        }

        closeCreationModal();
    };

    //======= Handlers for user join/leave =======================//
    const handleJoinUser = () => {
        //Check if the user is already a member of the classroom
        if (isUserJoined) {
            alert("You are already a member of this classroom.");
            return;
        }

        //Send API call to join the user in the backend
        addUser(currentClassroom.id);
        setIsUserJoined(true);
    }

    const handleLeaveUser = () => {
        //Check if the user is not a member of this classroom
        if (!isUserJoined) {
            alert("You are not a member of this classroom.");
            return;
        }

        //Send API call to leave the user in the backend
        removeUser(currentClassroom.id);
        setIsUserJoined(false);
    }

    //======= Handler for delete classroom ===============================//
    const handleDeleteClassroom = async() => {
        //Check that the user owns the classroom
        console.log("Classroom: ", currentClassroom);
        console.log(`UserId: ${userdata.id} and Classroom owner: ${currentClassroom.ownerId}`);
        if (userdata.id !== currentClassroom.ownerId) {
            alert("You cannot delete a classroom that you do not own.");
            return;
        }

        //Send API call to delete classroom in the backend
        await deleteClassroom(currentClassroom.id);
    }


    // ====== Modal Rendering Helper: Handles the two-step form flow ======//

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
                        <textarea name="description" value={newContentData.description}
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
    return (
        <main className="dashboard-page">
            {/* Navigation component. 'content' is the active tab for this page's context */}
            <DashboardNav
                initialActiveTab={'content'}
                onTabChange={setActiveTab}
            />

            {/*Buttons for adding/removing a user to a classroom*/}
            {<section className="classroom-button-box">
                <div className="classroom-button-group"> {/*Not sure if this needs a wrapper div, so this can be removed if not*/}
                    <button id="join-classroom" onClick={handleJoinUser}>Join Classroom</button>
                    <button id="leave-classroom" onClick={handleLeaveUser}>Leave Classroom</button>
                </div>
            </section>}

            {/*Button for deleting a classroom*/}
            {<section className="delete-button-box">
                <button id="delete-classroom" onClick={handleDeleteClassroom}>Delete Classroom</button>
            </section>}

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
                        {/* QUIZZES QUIZ */}

                        <div className="dashboard-box-header">
                            <h2>{currentClassroom.name} Quizzes</h2>
                        </div>
                        <div className ="classroom-grid">
                            {/* Map through the content and display using ResourceCard */}
                            {content.map((item) => (
                                <ResourceCard
                                    key={item.id}
                                    resource={item}
                                    isClassroomLevel={false} // Tells the card to render as static content
                                />
                            ))}
                        </div>

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
                    <p><strong>Username:</strong> {userdata?.name || 'Loading...'}</p>
                    <p><strong>Email:</strong> {userdata?.email || 'N/A'}</p>
                    <p><strong>Role:</strong> Student</p>
                </section>
            )}
        </main>
    );
};

export default ClassroomPage;