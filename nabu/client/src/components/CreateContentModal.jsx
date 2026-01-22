import React from 'react';

const CreateContentModal = ({ step, onClose, onSelectType, formData, onFormChange, onSubmit }) => {
    
    if (!step) return null;

    const renderContent = () => {
        // STEP 1: SELECT TYPE
        if (step === 'selectType') {
            return (
                <>
                    <p className="add-type-text">Choose content type:</p>
                    <div className="add-type-options">
                        <button type="button" className="add-type-card" onClick={() => onSelectType('flashcard')}>
                            <h4>Flash Card</h4>
                            <p>Create a simple flip-card.</p>
                        </button>
                        <button type="button" className="add-type-card" onClick={() => onSelectType('quiz')}>
                            <h4>Quiz</h4>
                            <p>Create a multiple choice quiz.</p>
                        </button>
                    </div>
                </>
            );
        }

        // STEP 2: FORM (Shared for both, since fields are the same now)
        const isFlashcard = step === 'flashcard';
        const typeName = isFlashcard ? 'Flash Card' : 'Quiz';

        return (
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{fontWeight: 600, display:'block', marginBottom:'5px'}}>
                        {isFlashcard ? 'Front (Title):' : 'Quiz Title:'}
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={onFormChange} 
                        required 
                        className="form-input-text" 
                        placeholder={isFlashcard ? "e.g. Mitochondria" : "e.g. Math Final"}
                    />
                </div>

                <div>
                    <label style={{fontWeight: 600, display:'block', marginBottom:'5px'}}>
                        {isFlashcard ? 'Back (Description/Answer):' : 'Description:'}
                    </label>
                    <textarea 
                        name="description" 
                        value={formData.description}
                        onChange={onFormChange} 
                        rows="4" 
                        className="form-input-text"
                        placeholder={isFlashcard ? "e.g. Powerhouse of the cell..." : "Describe this quiz..."}
                    />
                </div>

                <button 
                    type="submit" 
                    className="nabu-btn nabu-btn-primary form-submit-btn"
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
                    <button type="button" className="add-type-close" onClick={onClose}>×</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default CreateContentModal;