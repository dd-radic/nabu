import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard';
import CreateContentModal from '../components/CreateContentModal';
import Button from '../components/Button';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const ClassroomPage = () => {
    // 1. Extract Hooks
    const {
        userdata, token, classrooms, addUser, removeUser, isMember,
        loadContent, createQuiz, createFlashcard, 
        leaderboard, deleteFlashcard, deleteQuiz
    } = useAuth();

    const { classroomId } = useParams();
    const navigate = useNavigate();

    // 2. State
    const [activeTab, setActiveTab] = useState('content');
    const [contentFilter, setContentFilter] = useState('all');
    
    // Modal & Form State
    const [creationStep, setCreationStep] = useState(null);
    const [newContentData, setNewContentData] = useState({ name: '', description: '' });
    const [editingItem, setEditingItem] = useState(null); // <--- NEW: Track item being edited

    const [content, setContent] = useState([]);
    const [isUserJoined, setIsUserJoined] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState([]);

    // 3. Derived Values
    const currentClassroom = useMemo(() => {
        return classrooms.find((room) => String(room.id) === String(classroomId));
    }, [classrooms, classroomId]);

    const displayedContent = useMemo(() => {
        if (contentFilter === 'all') return content;
        return content.filter(item => item.type === contentFilter);
    }, [content, contentFilter]);

    const isOwner = useMemo(() => {
        if (!userdata || !currentClassroom) return false;
        const roomOwner = currentClassroom.ownerID || currentClassroom.ownerId || currentClassroom.creatorId;
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
            } catch (err) { }
        };
        initJoin();
    }, [currentClassroom, isMember]);

    useEffect(() => {
        const fetchLeaderboard = async() => {
            if(!currentClassroom || !showLeaderboard) return;
            try {
                const data = await leaderboard(classroomId);
                setLeaderboardData(Array.isArray(data) ? data : []);
            } catch (err){
                setLeaderboardData([]);
            }
        };
        fetchLeaderboard();
    }, [classroomId, currentClassroom, leaderboard, showLeaderboard]);

    // 5. Handlers
    const handleAddClick = useCallback(() => {
        setEditingItem(null); // Ensure we are in "Add" mode
        if (contentFilter === 'Flashcard') setCreationStep('flashcard');
        else if (contentFilter === 'Quiz') setCreationStep('quiz');
        else setCreationStep('selectType');
    }, [contentFilter]);

    // --- NEW: Handle Edit Click ---
    const handleEditClick = useCallback((item) => {
        setEditingItem(item); // Set the item we are editing
        setNewContentData({ 
            name: item.name, 
            description: item.description || item.summary || '' 
        });
        // Open the correct modal type
        if (item.type === 'Flashcard') setCreationStep('flashcard');
        else if (item.type === 'Quiz') setCreationStep('quiz');
    }, []);

    const closeCreationModal = useCallback(() => {
        setCreationStep(null);
        setEditingItem(null); // Clear editing state
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

    // --- SUBMIT HANDLER (Handles Create AND Edit) ---
    const handleCreateContentSubmit = useCallback(async (e) => {
        e.preventDefault();

        // 1. IF EDITING (Frontend Logic Only for now)
        if (editingItem) {
            // NOTE: You need an 'updateFlashcard' or 'updateQuiz' function from useAuth to save this to DB.
            // For now, we update the local UI so it looks like it works.
            const updatedItem = { ...editingItem, name: newContentData.name, description: newContentData.description };
            
            setContent(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
            
            console.log("Updated Item (Backend needed):", updatedItem);
            closeCreationModal();
            return;
        }

        // 2. IF CREATING (Existing Logic)
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
            if (savedFC) {
                newItem = { 
                    id: savedFC.id, 
                    name: newContentData.name, 
                    type: "Flashcard", 
                    description: newContentData.description 
                };
            }
        }

        if (newItem) setContent(prev => [...prev, newItem]);
        closeCreationModal();
    }, [creationStep, newContentData, classroomId, userdata, createQuiz, createFlashcard, closeCreationModal, editingItem]);


    if (!userdata?.id && !token) return <Navigate to="/" />;
    if (!currentClassroom) return <Navigate to="/dashboard" replace />;

    return (
        <main className="dashboard-page">
            <DashboardNav initialActiveTab={'content'} onTabChange={setActiveTab} showBackButton={true} />

            <section className="dashboard-box classroom-header-box">
                <div className="classroom-info">
                    <h2>My Classroom: {currentClassroom.name}</h2>
                    <p>Description: {currentClassroom.description || "No description provided."}</p>
                </div>
                <div className="classroom-actions">
                    <Button variant="outline" onClick={() => setShowLeaderboard(true)} style={{ marginRight: '10px' }}>
                         🏆 Leaderboard
                    </Button>
                    {!isUserJoined ? (
                        <Button onClick={handleJoinUser}>Join Classroom</Button>
                    ) : (
                        <Button variant="secondary" onClick={handleLeaveUser}>Leave Classroom</Button>
                    )}
                </div>
            </section>

            {(activeTab === 'content' || activeTab === 'classrooms') && (
                <section className="dashboard-box">
                    {showLeaderboard ? (
                        <div className="leaderboard-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2>🏆 Class Leaderboard</h2>
                                <Button variant="secondary" onClick={() => setShowLeaderboard(false)}>Exit Leaderboard</Button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
                                        <th>Rank</th><th>Student</th><th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.length === 0 ? (
                                        <tr><td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>📉 No scores yet</td></tr>
                                    ) : (
                                        leaderboardData.map((user, index) => (
                                            <tr key={user.UserId || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td style={{ padding: '15px' }}>{index + 1}</td>
                                                <td style={{ padding: '15px' }}>{user.Username}</td>
                                                <td style={{ padding: '15px', color: '#2563eb' }}>{user.Score || 0} pts</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* STANDARD CONTENT GRID */
                        <>
                            <div className="dashboard-row" style={{ justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
                                <button className={`dashboard-tab ${contentFilter === 'all' ? 'dashboard-tab-active' : ''}`} onClick={() => setContentFilter('all')}>All</button>
                                <button className={`dashboard-tab ${contentFilter === 'Flashcard' ? 'dashboard-tab-active' : ''}`} onClick={() => setContentFilter('Flashcard')}>Flashcards</button>
                                <button className={`dashboard-tab ${contentFilter === 'Quiz' ? 'dashboard-tab-active' : ''}`} onClick={() => setContentFilter('Quiz')}>Quizzes</button>
                            </div>

                            {displayedContent.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                    <p>No content found.</p>
                                </div>
                            ) : (
                                <div className="classroom-grid">
                                    {displayedContent.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{ position: "relative" }}
                                            onMouseEnter={() => setHoveredId(item.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            // Only Quizzes navigate; Flashcards just flip on internal click
                                            //onClick={item.type === 'Quiz' ? () => navigate(`/quiz/${item.id}`) : undefined}
                                        >
                                            <ResourceCard resource={item} isClassroomLevel={false} />
                                            
                                            {/* ACTION BUTTONS (Edit & Delete) */}
                                            {hoveredId === item.id && isOwner && (
                                                <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, display: 'flex', gap: '5px' }}>
                                                    {/* NEW: EDIT BUTTON */}
                                                    <Button variant="outline" size="icon" title="Edit" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
                                                        ✏️
                                                    </Button>
                                                    {/* DELETE BUTTON */}
                                                    <Button variant="outline" size="icon" title="Delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}>
                                                        🗑️
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="button" className="floating-add-btn" onClick={handleAddClick}>+</button>

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

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title="Delete content?"
                message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    if (deleteTarget.type === 'Flashcard' && deleteFlashcard) deleteFlashcard(deleteTarget.id);
                    else if (deleteTarget.type === 'Quiz' && deleteQuiz) deleteQuiz(deleteTarget.id);
                    setContent((prev) => prev.filter((c) => c.id !== deleteTarget.id));
                    setDeleteTarget(null);
                }}
            />
        </main>
    );
};

export default ClassroomPage;