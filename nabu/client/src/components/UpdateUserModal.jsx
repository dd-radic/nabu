import React from 'react';

const UpdateUserModal = ({ 
    isOpen, 
    onClose, 
    currentUsername, 
    newUsername, 
    setNewUsername, 
    onSubmit, 
    error, 
    success 
}) => {
    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onClose}>
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>
                <div className="add-type-header">
                    <h3>Update Username</h3>
                    <button type="button" className="add-type-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <label>Current username:</label>
                    <input
                        type="text"
                        value={currentUsername || ""}
                        readOnly
                        className="form-input-text"
                    />

                    <label>New username:</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter a new username"
                        className="form-input-text"
                    />

                    {error && (
                        <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
                    )}
                    {success && (
                        <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>
                    )}

                    <button
                        type="submit"
                        className="dashboard-btn form-submit-btn"
                        style={{ marginTop: "1rem" }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserModal;