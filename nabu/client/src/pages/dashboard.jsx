import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import ResourceCard from '../components/ResourceCard';
import SearchBar from "../components/SearchBar";
import { Navigate } from 'react-router-dom';
import CreateClassroomModal from '../components/CreateClassroomModal';
import UpdateUserModal from '../components/UpdateUserModal';
import Button from '../components/Button';
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
    // 1. Extract Hooks
    const {
        classrooms, userdata, token, addClassroom, userLevel,
        deleteClassroom, logOut
    } = useAuth();

    // 2. State
    //const [activeTab, setActiveTab] = useState('classrooms');
    const [showUpdateBox, setShowUpdateBox] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'classrooms';

    const [showFilter, setShowFilter] = useState(false);
    const [sortMode, setSortMode] = useState("none");
    const [search, setSearch] = useState("");

    // Classroom Form State
    const [showAddClassroomForm, setShowAddClassroomForm] = useState(false);
    const [newClassroomData, setNewClassroomData] = useState({ name: '', description: '' });

    const [hiddenClassroomIds, setHiddenClassroomIds] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [level, setLevel] = useState();

    useEffect(() => {
        const fetchLevel = async () => {
            if (userdata?.id) {
                try {
                    const levelData = await userLevel();
                    setLevel(levelData);
                } catch (err) {
                    setLevel(0);
                }
            }
        };
        fetchLevel();
    }, [userLevel, userdata?.id]);

    // 3. Derived Values
    const filteredClassrooms = useMemo(() => {
        let result = classrooms.filter(c =>
            !hiddenClassroomIds.includes(c.id)).filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            );
        if (sortMode === "az") {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortMode === "za") {
            result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        }
        return result;
    }, [classrooms, search, sortMode, hiddenClassroomIds]);

    const userProfile = useMemo(() => ({
        username: userdata?.name || 'Loading...',
        email: userdata?.email || 'N/A',
        level: level || 0,
    }), [level, userdata?.email, userdata?.name]);

    // 4. Handlers
    const handleAddClassroomClick = useCallback(() => {
        setNewClassroomData({ name: '', description: '' });
        setShowAddClassroomForm(true);
    }, []);

    const closeAddClassroomForm = useCallback(() => {
        setShowAddClassroomForm(false);
        setNewClassroomData({ name: '', description: '' });
    }, []);

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewClassroomData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCreateClassroomSubmit = useCallback(async (e) => {
        e.preventDefault();
        // CREATE MODE
        const payload = {
            title: newClassroomData.name,
            description: newClassroomData.description,
            ownerID: userdata.id
        };
        await addClassroom(payload);
        closeAddClassroomForm();
    }, [newClassroomData, userdata, addClassroom, closeAddClassroomForm]);

    // ... (User Update Handlers) ...
    const openUpdateBox = useCallback(() => {
        setNewUsername("");
        setUpdateError("");
        setUpdateSuccess("");
        setShowUpdateBox(true);
    }, []);

    const closeUpdateBox = useCallback(() => {
        setShowUpdateBox(false);
    }, []);

    const handleUpdateSubmit = useCallback((e) => {
        e.preventDefault();
        setUpdateError("");
        setUpdateSuccess("");
        if (!newUsername.trim()) {
            setUpdateError("Error: Username cannot be empty");
            return;
        }
        setUpdateSuccess("Success (Mock)");
    }, [newUsername]);

    const toggleFilter = useCallback(() => {
        setShowFilter(prev => !prev);
    }, []);

    // 5. Guards
    if (!token && !userdata?.id) {
        return <Navigate to="/" replace />;
    }

    // 6. Render
    return (
        <main className="dashboard-page">
            {/*<DashboardNav initialActiveTab={activeTab} onTabChange={setActiveTab} />*/}

            {/* Profile View */}
            {activeTab === 'profile' && (
                <section className="dashboard-box">
                    <h2>Profile</h2>
                    <p><strong>Username:</strong> {userProfile.username}</p>
                    <p><strong>Email:</strong> {userProfile.email}</p>
                    <p><strong>Level:</strong> {userProfile.level}</p>

                    <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
                        <Button onClick={openUpdateBox}>Update details</Button>
                        <Button variant="danger" onClick={() => { }}>Delete account</Button>
                        <Button onClick={() => { logOut(); window.location.href = '/'; }}>   Logout   </Button>

                    </div>
                </section>
            )}

            {/* Classrooms List View */}
            {activeTab === 'classrooms' && (
                <section className="dashboard-box">
                    
                    <div className="dashboard-box-header">
                        <h2>My Classrooms</h2>
                    </div>

                    {classrooms.length === 0 ? (
                        <p>No classrooms created yet. Click + to add one.</p>
                    ) : filteredClassrooms.length === 0 ? (
                        <p>No classrooms match your search.</p>
                    ) : (
                        <div className="classroom-grid">
                           {filteredClassrooms
                             .filter((room) => {
                                  const roomOwner = room.ownerID || room.ownerId || room.creatorId;
                           return String(userdata.id) === String(roomOwner);
                             })
                              .map((room) => (
                             <div
                                key={room.id}
                                style={{ position: "relative" }}
                                onMouseEnter={() => setHoveredId(room.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                >
                            <ResourceCard resource={room} isClassroomLevel={true} />

                            {hoveredId === room.id && (
                                <div style={{ position: "absolute", top: 10, right: 10 }}>
                                    <Button
                                     variant="outline"
                                     size="icon"
                                     title="Delete"
                                     type="button"
                                     onClick={(e) => {
                                        e.preventDefault();
                                        setDeleteTarget(room);
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

                    <div className="dashboard-box-header">
                        <h2>Joined Classrooms</h2>
                    </div>
                    {classrooms.length === 0 ? (
                        <p>No classrooms created yet. Click + to add one.</p>
                    ) : filteredClassrooms.length === 0 ? (
                        <p>No classrooms match your search.</p>
                    ) : (
                        <div className="classroom-grid">
                            {filteredClassrooms.map((room) => {
                                // 🔒 SECURITY CHECK: Are you the owner?
                                const roomOwner = room.ownerID || room.ownerId || room.creatorId;
                                const isOwner = String(userdata.id) === String(roomOwner);

                                return (
                                    <div
                                        key={room.id}
                                        style={{ position: "relative" }}
                                        onMouseEnter={() => setHoveredId(room.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        <ResourceCard resource={room} isClassroomLevel={true} />

                                        {/* Only show DELETE button if hovered AND is owner */}
                                        {hoveredId === room.id && isOwner && (
                                            <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Delete"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent link click
                                                        setDeleteTarget(room);
                                                    }}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}


                    <div className="dashboard-box-header">
                        <h2>All Classrooms</h2>
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            onFilterClick={toggleFilter}
                        />
                        {showFilter && (
                            <div className="filter-dropdown">
                                <button onClick={() => setSortMode("az")}>Sort A → Z {sortMode === "az" && "✔"}</button>
                                <button onClick={() => setSortMode("za")}>Sort Z → A {sortMode === "za" && "✔"}</button>
                                <button onClick={() => setSortMode("none")}>Reset {sortMode === "none" && "✔"}</button>
                            </div>
                        )}
                    </div>
                    {classrooms.length === 0 ? (
                        <p>No classrooms created yet. Click + to add one.</p>
                    ) : filteredClassrooms.length === 0 ? (
                        <p>No classrooms match your search.</p>
                    ) : (
                        <div className="classroom-grid">
                            {filteredClassrooms.map((room) => {
                                // 🔒 SECURITY CHECK: Are you the owner?
                                const roomOwner = room.ownerID || room.ownerId || room.creatorId;
                                const isOwner = String(userdata.id) === String(roomOwner);

                                return (
                                    <div
                                        key={room.id}
                                        style={{ position: "relative" }}
                                        onMouseEnter={() => setHoveredId(room.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        <ResourceCard resource={room} isClassroomLevel={true} />

                                        {/* Only show DELETE button if hovered AND is owner */}
                                        {hoveredId === room.id && isOwner && (
                                            <div style={{ position: "absolute", top: 10, right: 10 }}>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Delete"
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent link click
                                                        setDeleteTarget(room);
                                                    }}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button type="button" className="floating-add-btn" onClick={handleAddClassroomClick}>+</button>

                    <CreateClassroomModal
                        isOpen={showAddClassroomForm}
                        onClose={closeAddClassroomForm}
                        formData={newClassroomData}
                        onFormChange={handleFormChange}
                        onSubmit={handleCreateClassroomSubmit}
                    />
                </section>
            )}

            <UpdateUserModal
                isOpen={showUpdateBox}
                onClose={closeUpdateBox}
                currentUsername={userProfile.username}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                onSubmit={handleUpdateSubmit}
                error={updateError}
                success={updateSuccess}
            />

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                title="Delete classroom?"
                message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    // Call backend delete if available
                    if (deleteClassroom) deleteClassroom(deleteTarget.id);
                    // Update local UI
                    setHiddenClassroomIds((prev) => [...prev, deleteTarget.id]);
                    setDeleteTarget(null);
                }}
            />

        </main>
    );
};

export default Dashboard;