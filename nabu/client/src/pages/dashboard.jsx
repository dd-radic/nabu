import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import DashboardNav from '../components/DashboardNav';
import ResourceCard from '../components/ResourceCard'; // Imports the new reusable card
import SearchBar from "../components/SearchBar";


const Dashboard = () => {

    //NOTE: DO NOT USE AUTH, use userdata instead
    const {classrooms, userdata, addClassroom} = useAuth();

    // We use the real auth data (user, email) for the profile view
    const userProfile = {
        username: userdata?.name || 'Loading...',
        email: userdata?.email || 'N/A',
        role: 'Student', // Still hardcoded for now
    };

    // Controls which view is currently shown: Classrooms list or Profile details
    const [activeTab, setActiveTab] = useState('classrooms');
    // State for the existing classrooms

    // Filter Dropdown sichtba
    const [showFilter, setShowFilter] = useState(false);

    // Optional: Sorting mode state
    const [sortMode, setSortMode] = useState("none");


    const [search, setSearch] = useState("");
    let filteredClassrooms = classrooms.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortMode === "az") {
        filteredClassrooms = [...filteredClassrooms].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    //ALWAYS SORT A COPY OF THE ARRAY OTHERWISE IT MESSES UP THE RENDERING IDs
    if (sortMode === "za") {
        filteredClassrooms = [...filteredClassrooms].sort((a, b) =>
            b.name.localeCompare(a.name)
        );
    }

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


   // if (!token) return <Navigate to='/'/>


    const handleCreateClassroomSubmit = async (e) => {
        e.preventDefault();


        // Backend waits for: title, description, ownerID
        const payload = {
            title: newClassroomData.name,
            description: newClassroomData.description,
            ownerID: userdata.id
        };

        await addClassroom(payload);
        closeAddClassroomForm();
    };

    console.log("Classrooms: ", classrooms);


    // ====== JSX Render ======


    return (
        <main className="dashboard-page">
            {/* Replaced the old button block with the reusable component */}
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
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            onFilterClick={() => setShowFilter(prev => !prev)}
                        />
                        {showFilter && (
                            <div className="filter-dropdown">
                                <button onClick={() => setSortMode("az")}>
                                    Sort A → Z
                                    {sortMode === "az" && <span className="checkmark">✔</span>}
                                </button>

                                <button onClick={() => setSortMode("za")}>
                                    Sort Z → A
                                    {sortMode === "za" && <span className="checkmark">✔</span>}
                                </button>

                                <button onClick={() => setSortMode("none")}>
                                    Reset
                                    {sortMode === "none" && <span className="checkmark">✔</span>}
                                </button>
                            </div>
                        )}



                    </div>

                    {/* Check if the list is empty */}
                    {classrooms.length === 0 ? (
                        <p>No classrooms created yet. Click + to add one.</p>
                    ) : filteredClassrooms.length === 0 ? (
                        <p>No classrooms match your search.</p>
                    ) : (
                        <div className="classroom-grid">
                            {filteredClassrooms.map((room) => (
                                <ResourceCard
                                    key={room.id}
                                    resource={room}
                                    isClassroomLevel={true}
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