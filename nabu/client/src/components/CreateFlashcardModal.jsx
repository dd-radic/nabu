import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button";

/**
 * CreateFlashcardModal
 * A pure frontend component for adding or editing flashcards.
 * It manages local form state and passes data back to the parent via onSubmit.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 * @param {function} onSubmit - Callback function that receives { question, answer }
 * @param {string} mode - "add" or "edit" to determine the title and button text
 * @param {object} initialData - Optional object { question, answer } to prefill the form
 */
const CreateFlashcardModal = ({ isOpen, onClose, onSubmit, mode = "add", initialData = null }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    // Sync local state with initialData whenever the modal opens
    useEffect(() => {
        if (!isOpen) return;
        setQuestion(initialData?.question || "");
        setAnswer(initialData?.answer || "");
    }, [isOpen, initialData]);

    // Validation: Check if both fields have non-empty values
    const canSubmit = useMemo(() => {
        return question.trim().length > 0 && answer.trim().length > 0;
    }, [question, answer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        // Pass the new/edited data to the parent component
        onSubmit({ question: question.trim(), answer: answer.trim() });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onClose}>
            {/* Stop click propagation to prevent closing when clicking inside the modal */}
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>

                {/* Modal Header */}
                <div className="add-type-header">
                    <h3>{mode === "edit" ? "Edit Flashcard" : "Create Flashcard"}</h3>
                    <button type="button" className="add-type-close" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <label>Question:</label>
                    <textarea
                        className="form-input-text"
                        rows="3"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter the question"
                        required
                    />

                    <label>Answer:</label>
                    <textarea
                        className="form-input-text"
                        rows="3"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter the answer"
                        required
                    />

                    <Button type="submit" disabled={!canSubmit}>
                        {mode === "edit" ? "Save" : "Submit"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateFlashcardModal;