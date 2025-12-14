import React, { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import "../components/Quiz.css";

// Helper to keep the option count between 2 and 4
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/**
 * ViewQuizQuestionModal
 * * A pure frontend component that displays a quiz question details.
 * It allows switching to an "Edit Mode" to modify the question text and options locally.
 * * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Handler to close the modal
 * @param {object} question - The question object { text, options[] }
 * @param {function} onSave - Callback to pass updated data back to the parent
 */
const ViewQuizQuestionModal = ({
    isOpen,
    onClose,
    question,
    onSave,
}) => {
    // Mode state: false = View Mode, true = Edit Mode
    const [isEditing, setIsEditing] = useState(false);

    // Local form state for editing
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]); // Always keep 4 slots in memory
    const [optionCount, setOptionCount] = useState(4); // Tracks how many are active (2, 3, or 4)

    // Reset internal state whenever the modal opens or the question prop changes
    useEffect(() => {
        if (!isOpen) return;

        // Default to View mode when opening
        setIsEditing(false);

        // Normalize input data
        const text = question?.text ?? "";
        const opts = Array.isArray(question?.options) ? question.options : [];

        // Determine how many options to show (min 2, max 4)
        const initialCount = clamp(opts.length || 4, 2, 4);
        setOptionCount(initialCount);

        setQuestionText(text);

        // Pad options array to ensure we always have 4 inputs available in memory
        const padded = [...opts];
        while (padded.length < 4) padded.push("");
        setOptions(padded.slice(0, 4));
    }, [isOpen, question]);

    // Calculate which options are currently visible based on the toggle buttons
    const visibleOptions = useMemo(
        () => options.slice(0, optionCount),
        [options, optionCount]
    );

    // Validation: Require question text and all visible options to be non-empty
    const canSave = useMemo(() => {
        if (!questionText.trim()) return false;
        return visibleOptions.every((o) => o.trim().length > 0);
    }, [questionText, visibleOptions]);

    // Handler to update a specific option string by index
    const setOptionValue = (index, value) => {
        setOptions((prev) => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };

    // Handler to switch between 2, 3, or 4 options
    const handleSetOptionCount = (count) => {
        setOptionCount(count);
    };

    // Save handler: Normalizes data and sends it up to the parent component
    const handleSave = () => {
        if (!canSave) return;

        const payload = {
            text: questionText.trim(),
            options: visibleOptions.map((o) => o.trim()),
        };

        onSave(payload);
        setIsEditing(false); // Switch back to view mode
        onClose();           // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onClose}>
            {/* Stop propagation ensures clicking inside the modal doesn't close it */}
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header Section */}
                <div className="add-type-header">
                    <h3>{isEditing ? "Edit Question" : "Question Details"}</h3>
                    <button type="button" className="add-type-close" onClick={onClose} aria-label="Close">
                        &times;
                    </button>
                </div>

                {/* Body Section */}
                {!question ? (
                    <p style={{ color: "#777" }}>No question selected.</p>
                ) : isEditing ? (
                    // ----- EDIT MODE -----
                    <>
                        {/* Option Count Toggles */}
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <Button
                                type="button"
                                variant={optionCount === 2 ? "primary" : "outline"}
                                onClick={() => handleSetOptionCount(2)}
                            >
                                2 options
                            </Button>
                            <Button
                                type="button"
                                variant={optionCount === 3 ? "primary" : "outline"}
                                onClick={() => handleSetOptionCount(3)}
                            >
                                3 options
                            </Button>
                            <Button
                                type="button"
                                variant={optionCount === 4 ? "primary" : "outline"}
                                onClick={() => handleSetOptionCount(4)}
                            >
                                4 options
                            </Button>
                        </div>

                        {/* Question Input */}
                        <label>Question:</label>
                        <input
                            className="form-input-text"
                            type="text"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Enter your question"
                            required
                        />

                        {/* Option Inputs */}
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

                        {/* Action Buttons (Edit Mode) */}
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsEditing(false)} // Cancel editing
                            >
                                Cancel
                            </Button>
                            <Button type="button" disabled={!canSave} onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </>
                ) : (
                    // ----- VIEW MODE -----
                    <>
                        {/* Question Text Display */}
                        <p
                            style={{
                                marginBottom: "0.75rem",
                                color: "var(--color-text-dark)",
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere", // Ensures long words don't break layout
                                wordBreak: "break-word",
                            }}
                        >
                            <strong>Question: </strong>{question.text}
                        </p>

                        {/* Options Display List */}
                        <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
                            {(question.options || []).map((opt, i) => (
                                <div
                                    key={i}
                                    style={{
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "10px",
                                        padding: "10px 12px",
                                        background: "var(--color-bg-light-gray)",
                                        width: "100%",
                                        maxWidth: "100%",
                                        boxSizing: "border-box",
                                        overflowWrap: "anywhere",
                                        wordBreak: "break-word",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    <strong>Option {i + 1}:</strong> {opt}
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons (View Mode) */}
                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                            <Button variant="secondary" onClick={onClose} type="button">
                                Close
                            </Button>
                            <Button onClick={() => setIsEditing(true)} type="button">
                                Edit Question
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewQuizQuestionModal;