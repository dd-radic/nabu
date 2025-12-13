import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard'; 
import CreateContentModal from '../components/CreateContentModal';
import Button from '../components/Button'; // Import the new Component

const ClassroomPage = () => {
    // 1. Extract Hooks
    const { 
        userdata, token, classrooms, addUser, removeUser, isMember, 
        deleteClassroom, loadContent, createQuiz, createFlashcard 
    } = useAuth();
    
    const { classroomId } = useParams();

    // 2. State
    const [activeTab, setActiveTab] = useState('content');
    const [contentFilter, setContentFilter] = useState('all'); 
    const [creationStep, setCreationStep] = useState(null);
    const [content, setContent] = useState([]);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const [newContentData, setNewContentData] = useState({ name: '', description: '' });

    // 3. Derived Values
    const currentClassroom = useMemo(() => {
        return classrooms.find((room) => String(room.id) === String(classroomId));
    }, [classrooms, classroomId]);

    const displayedContent = useMemo(() => {
        if (contentFilter === 'all') return content;
        return content.filter(item => item.type === contentFilter);
    }, [content, contentFilter]);

    // Check ownership
    const isOwner = useMemo(() => {
        if (!userdata || !currentClassroom) return false;
        const roomOwner = currentClassroom.ownerID || currentClassroom.ownerId;
        return String(userdata.id) === String(roomOwner);
    }, [userdata, currentClassroom]);

    // 4. Effects
    useEffect(() => {
        if (!userdata?.id && !token) return;
        if (!currentClassroom) return;
        loadContent(userdata, classroomId, setContent);
    }, [userdata, token, loadContent, currentClassroom, classroomId]);

    useEffect(() => {
        if (!currentClassroom) return;
        const initJoin = async () => {
            try {
                const member = await isMember(currentClassroom.id);
                setIsUserJoined(member);
            } catch (err) {
                // handle error silently
            }
        };
        initJoin();
    }, [currentClassroom, isMember]);

    // 5. Handlers
    const handleAddClick = useCallback(() => {
        if (contentFilter === 'Flashcard') setCreationStep('flashcard');
        else if (contentFilter === 'Quiz') setCreationStep('quiz');
        else setCreationStep('selectType');
    }, [contentFilter]);

    const closeCreationModal = useCallback(() => {
        setCreationStep(null);
        setNewContentData({ name: '', description: '' });
    }, []);

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewContentData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleJoinUser = useCallback(() => {
        if (isUserJoined) return alert("You are already a member.");
        addUser(currentClassroom.id);
        setIsUserJoined(true);
    }, [isUserJoined, addUser, currentClassroom]);

    const handleLeaveUser = useCallback(() => {
        if (!isUserJoined) return alert("You are not a member.");
        if(window.confirm("Are you sure you want to leave this classroom?")) {
            removeUser(currentClassroom.id);
            setIsUserJoined(false);
        }
    }, [isUserJoined, removeUser, currentClassroom]);

    const handleDeleteClassroom = useCallback(async () => {
        if (!isOwner) return alert("You cannot delete a classroom that you do not own.");
        
        if(window.confirm("WARNING: This will delete the classroom and all its content. Are you sure?")) {
             await deleteClassroom(currentClassroom.id);
        }
    }, [isOwner, currentClassroom, deleteClassroom]);

    const handleCreateContentSubmit = useCallback(async (e) => {
        e.preventDefault();
        let newItem = null;
        if (creationStep === "quiz") {
            const quizPayload = {
                title: newContentData.name,
                description: newContentData.description,
                classRoomId: classroomId,
                creatorId: userdata.id
            };
            const savedQuiz = await createQuiz(quizPayload);
            if(savedQuiz) newItem = { id: savedQuiz.Id, name: savedQuiz.Title, type: "Quiz", summary: savedQuiz.Description };
        } else if (creationStep === "flashcard") {
            const fcPayload = {
                classRoomId: classroomId,
                title: newContentData.name,
                information: newContentData.description,
                tags: "default"
            };
            const savedFC = await createFlashcard(fcPayload);
            if(savedFC) newItem = { id: savedFC.id, name: newContentData.name, type: "Flashcard", summary: newContentData.description };
        }

        if (newItem) setContent(prev => [...prev, newItem]);
        closeCreationModal();
    }, [creationStep, newContentData, classroomId, userdata, createQuiz, createFlashcard, closeCreationModal]);


    // 6. Guards
    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!currentClassroom) return <Navigate to="/dashboard" replace />;

    // 7. Render
    return (
        <main className="dashboard-page">
            <DashboardNav initialActiveTab={'content'} onTabChange={setActiveTab} />

            {/* === HEADER SECTION === */}
            <section className="dashboard-box classroom-header-box">
                <div className="classroom-info">
                    <h1>{currentClassroom.name}</h1>
                    <p>{currentClassroom.description || "No description provided."}</p>
                </div>

                <div className="classroom-actions">
                    {/* 1. Join Button (Replaced with Component) */}
                    <Button onClick={handleJoinUser}>
                        Join Classroom
                    </Button>

                    {/* 2. Leave Button (Replaced with Component) */}
                    <Button variant="secondary" onClick={handleLeaveUser}>
                        Leave Classroom
                    </Button>
                    
                    {/* 3. Delete Button (Replaced with Component) */}
                    {isOwner && (
                        <Button variant="danger" onClick={handleDeleteClassroom}>
                            Delete Classroom
                        </Button>
                    )}
                </div>
            </section>

            {/* === CONTENT SECTION === */}
            {(activeTab === 'content' || activeTab === 'classrooms') && (
                <section className="dashboard-box">
                    <div className="dashboard-row" style={{justifyContent: 'flex-start', marginBottom: '1.5rem'}}>
                        <button 
                            className={`dashboard-tab ${contentFilter === 'all' ? 'dashboard-tab-active' : ''}`}
                            onClick={() => setContentFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`dashboard-tab ${contentFilter === 'Flashcard' ? 'dashboard-tab-active' : ''}`}
                            onClick={() => setContentFilter('Flashcard')}
                        >
                            Flashcards
                        </button>
                        <button 
                            className={`dashboard-tab ${contentFilter === 'Quiz' ? 'dashboard-tab-active' : ''}`}
                            onClick={() => setContentFilter('Quiz')}
                        >
                            Quizzes
                        </button>
                    </div>

                    {displayedContent.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
                            <p>No {contentFilter === 'all' ? 'content' : contentFilter} found.</p>
                            <p>Click the <strong>+</strong> button to create one!</p>
                        </div>
                    ) : (
                        <div className="classroom-grid">
                            {displayedContent.map((item) => (
                                <ResourceCard key={item.id} resource={item} isClassroomLevel={false} />
                            ))}
                        </div>
                    )}

                    <button type="button" className="floating-add-btn" onClick={handleAddClick}>
                        +
                    </button>

                    <CreateContentModal 
                        step={creationStep}
                        onClose={closeCreationModal}
                        onSelectType={setCreationStep}
                        formData={newContentData}
                        onFormChange={handleFormChange}
                        onSubmit={handleCreateContentSubmit}
                    />
                </section>
            )}

            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    <p><strong>Username:</strong> {userdata?.name}</p>
                    <p><strong>Email:</strong> {userdata?.email}</p>
                </section>
            )}
        </main>
    );
};

export default ClassroomPage;