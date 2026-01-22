import React from 'react';
import Button from "./Button";
const CreateClassroomModal = ({
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit
}) => {
    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onClose}>
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>
                <div className="add-type-header">
                    <h3>Create New Classroom</h3>
                    <button type="button" className="add-type-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <label>Classroom Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onFormChange}
                        required
                        className="form-input-text"
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onFormChange}
                        rows="3"
                        className="form-input-text"
                        maxLength="150"
                    />

                    <button
                        type="submit"
                        className="nabu-btn nabu-btn-primary form-submit-btn"
                        disabled={!formData.name}
                    >
                        Create Classroom
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateClassroomModal;