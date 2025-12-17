import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard';
import CreateContentModal from '../components/CreateContentModal';
import Button from '../components/Button'; // Import the new Component
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';



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
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    ///////////////////////////////////////////////
    // Mock Data (Later you will fetch this from your API)
    const leaderboardData = [];



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
        if (window.confirm("Are you sure you want to leave this classroom?")) {
            removeUser(currentClassroom.id);
            setIsUserJoined(false);
        }
    }, [isUserJoined, removeUser, currentClassroom]);


    const handleDeleteContent = useCallback((item) => {
        if (!window.confirm(`Delete "${item.name}"?`)) return;
        setContent((prev) => prev.filter((c) => c.id !== item.id));
    }, []);



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
            if (savedQuiz) newItem = { id: savedQuiz.Id, name: savedQuiz.Title, type: "Quiz", summary: savedQuiz.Description };
        } else if (creationStep === "flashcard") {
            const fcPayload = {
                classRoomId: classroomId,
                title: newContentData.name,
                information: newContentData.description,
                tags: "default"
            };
            const savedFC = await createFlashcard(fcPayload);
            if (savedFC) newItem = { id: savedFC.id, name: newContentData.name, type: "Flashcard", summary: newContentData.description };
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
            <DashboardNav initialActiveTab={'content'} onTabChange={setActiveTab} showBackButton={true} />

            {/* === HEADER SECTION === */}
            <section className="dashboard-box classroom-header-box">
                <div className="classroom-info">
                    <h2>My Classroom: {currentClassroom.name}</h2>
                    <p>Description: {currentClassroom.description || "No description provided."}</p>

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

                      {/* 3. Leaderboard */}
                      <Button variant="outline" onClick={() => setShowLeaderboard(true)} style={{ marginRight: '10px' }}>
                        🏆 Leaderboard
                     </Button>
                </div>
            </section>


            {/* === CONTENT SECTION WITH LEADERBOARD TOGGLE === */}
            {(activeTab === 'content' || activeTab === 'classrooms') && (
                <section className="dashboard-box">
                    
                    {/* 1. CHECK: IF SHOW LEADERBOARD IS TRUE, SHOW RANKINGS */}
                    {showLeaderboard ? (
                        <div className="leaderboard-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2>🏆 Class Leaderboard</h2>
                                
                                {/* EXIT BUTTON */}
                                <Button variant="secondary" onClick={() => setShowLeaderboard(false)}>
                                    Exit Leaderboard
                                </Button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
                                        <th style={{ padding: '10px' }}>Rank</th>
                                        <th style={{ padding: '10px' }}>Student</th>
                                        <th style={{ padding: '10px' }}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                                                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📉 No scores yet</p>
                                                <p style={{ fontSize: '0.9rem' }}>Be the first to complete a quiz!</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        leaderboardData.map((user, index) => (
                                            <tr 
                                                key={user.id} 
                                                style={{ 
                                                    borderBottom: '1px solid #f0f0f0',
                                                    backgroundColor: user.name === 'You' ? '#f0f9ff' : 'transparent',
                                                    fontWeight: index < 3 ? 'bold' : 'normal' 
                                                }}
                                            >
                                                <td style={{ padding: '15px' }}>
                                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${user.rank}`}
                                                </td>
                                                <td style={{ padding: '15px' }}>{user.name}</td>
                                                <td style={{ padding: '15px', color: '#2563eb' }}>{user.score} pts</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* 2. ELSE: SHOW THE REGULAR CONTENT (YOUR EXISTING CODE) */
                        <>
                            <div className="dashboard-row" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
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

                            {/* ... (Keep your existing displayedContent.length check and map loop here) ... */}
                            {displayedContent.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    <p>No {contentFilter === 'all' ? 'content' : contentFilter} found.</p>
                                    <p>Click the <strong>+</strong> button to create one!</p>
                                </div>
                            ) : (
                                <div className="classroom-grid">
                                    {displayedContent.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{ position: "relative" }}
                                            onMouseEnter={() => setHoveredId(item.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                        >
                                            <ResourceCard resource={item} isClassroomLevel={false} />
                                            
                                            {/* (Remember to add && isOwner here as we discussed!) */}
                                            {hoveredId === item.id && isOwner && (
                                                <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteTarget(item);
                                                        }}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
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
                        </>
                    )}
                </section>
            )}

            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    <p><strong>Username:</strong> {userdata?.name}</p>
                    <p><strong>Email:</strong> {userdata?.email}</p>
                </section>
            )}
            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title="Delete content?"
                message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    setContent((prev) =>
                        prev.filter((c) => c.id !== deleteTarget.id)
                    );
                    setDeleteTarget(null);
                }}
            />

        </main>
    );
};

export default ClassroomPage;