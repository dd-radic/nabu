import React from 'react';

/**
 * Reusable Modal for creating Content (Quizzes/Flashcards).
 * Extracted to satisfy Style Guide .
 */
const CreateContentModal = ({ 
    step, 
    onClose, 
    onSelectType, 
    formData, 
    onFormChange, 
    onSubmit 
}) => {
    
    if (!step) return null;

    // Helper to render the internal content based on the step
    const renderContent = () => {
        if (step === 'selectType') {
            return (
                <>
                    <p className="add-type-text">Choose content type:</p>
                    <div className="add-type-options">
                        <button type="button" className="add-type-card" onClick={() => onSelectType('flashcard')}>
                            <h4>Flash Card</h4>
                            <p>Define terms and concepts.</p>
                        </button>
                        <button type="button" className="add-type-card" onClick={() => onSelectType('quiz')}>
                            <h4>Quiz</h4>
                            <p>Create questions for assessment.</p>
                        </button>
                    </div>
                </>
            );
        }

        const isFlashcard = step === 'flashcard';
        const typeName = isFlashcard ? 'Flash Card Set' : 'Quiz';

        return (
            <form onSubmit={onSubmit}>
                <label>{typeName} Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={onFormChange} 
                    required 
                    className="form-input-text" 
                />

                <label>Summary / Description:</label>
                <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={onFormChange} 
                    rows="2" 
                    className="form-input-text"
                    maxLength="150"
                    placeholder={isFlashcard ? "e.g., Key definitions..." : "e.g., Multiple choice..."}
                />

                <button 
                    type="submit" 
                    className="dashboard-btn form-submit-btn"
                    disabled={!formData.name}
                >
                    Create {typeName}
                </button>
            </form>
        );
    };

    return (
        <div className="add-type-overlay" onClick={onClose}>
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>
                <div className="add-type-header">
                    <h3>
                        {step === 'selectType' && 'Select Content Type'}
                        {step !== 'selectType' && (step === 'flashcard' ? 'Create Flash Card' : 'Create Quiz')}
                    </h3>
                    <button type="button" className="add-type-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default CreateContentModal;