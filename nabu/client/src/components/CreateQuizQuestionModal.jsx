import React, { useMemo, useState, useEffect } from "react";
import Button from "./Button";
import "../components/Quiz.css";
import { useAuth } from "../AuthProvider";

/**
 * CreateQuizQuestionModal
 * * A pure frontend modal for creating a new quiz question.
 * It manages form state locally and passes the final data object
 * up to the parent component via the onSubmit callback.
 * * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Handler to close the modal
 * @param {function} onSubmit - Callback receives { text, options[] }
 */
const CreateQuizQuestionModal = ({ isOpen, onClose, onSubmit }) => {
    // Local state for the form
    const [optionCount, setOptionCount] = useState(4);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState("");
    const [questionType, setQuestionType] = useState("");

    // Reset the form whenever the modal opens to ensure a clean state
    useEffect(() => {
        if (!isOpen) return;
        setOptionCount(4);
        setQuestionType("multiplechoice");
        setQuestionText("");
        setOptions(["", "", "", ""]);
    }, [isOpen]);


    // Calculate which options are currently relevant based on the count selector
    const visibleOptions = useMemo(
        () => options.slice(0, optionCount),
        [options, optionCount]
    );

    // Update a specific option string in the array
    const setOptionValue = (index, value) => {
        setOptions((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    // Validation: Ensure question text and all active options are not empty
    const canSubmit = useMemo(() => {
        if (!questionText.trim()) return false;
        return visibleOptions.every((o) => o.trim().length > 0);
    }, [questionText, visibleOptions]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        // Pass data to parent (Pure JS object, no API call)
        onSubmit({
            questionType: questionType,
            text: questionText.trim(),
            options: visibleOptions.map((o) => o.trim()).join("//"),
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onClose}>
            {/* Stop propagation ensures clicking inside the modal doesn't close it */}
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header Section */}
                <div className="add-type-header">
                    <h3>Add Quiz Question</h3>
                    <button
                        type="button"
                        className="add-type-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Option Count Selector Buttons */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <Button
                        variant={optionCount === 4 ? "primary" : "outline"}
                        questionType = "multiplechoice"
                        onClick={() => {
                            setOptionCount(4);
                            setQuestionType("multiplechoice");
                        } }
                        type="button"
                    >
                        Multiple Choice
                    </Button>
                    <Button
                        variant={optionCount === 1 ? "primary" : "outline"}
                        onClick={() => {
                            setOptionCount(1);
                            setQuestionType("truefalse");
                        } }
                        type="button"
                    >
                        True/False
                    </Button>
                </div>

                {/* Question Form */}
                <form onSubmit={handleSubmit}>
                    <label>Question:</label>
                    <input
                        className="form-input-text"
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter your question"
                        required
                    />

                    <label>Options:</label>
                    {Array.from({ length: optionCount }).map((_, i) => (
                        <input
                            key={i}
                            className="form-input-text"
                            type="text"
                            value={options[i]}
                            onChange={(e) => setOptionValue(i, e.target.value)}
                            placeholder={`Option ${i + 1}`}

                            required
                        />
                    ))}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={!canSubmit}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuizQuestionModal;