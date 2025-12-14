import React from "react";
import Button from "./Button";

/**
 * ConfirmDeleteModal
 * A generic, reusable modal for confirming destructive actions.
 * It is purely presentational and relies on the parent component to handle the actual deletion logic.
 *
 * @param {boolean} isOpen - Controls visibility of the modal
 * @param {string} title - The header text (default: "Are you sure?")
 * @param {string} message - The warning body text
 * @param {function} onConfirm - Callback to execute the delete action
 * @param {function} onCancel - Callback to close the modal without deleting
 */
const ConfirmDeleteModal = ({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="add-type-overlay" onClick={onCancel}>
            {/* Stop propagation ensures clicking inside the modal box doesn't trigger onCancel */}
            <div className="add-type-modal" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="add-type-header">
                    <h3>{title}</h3>
                    <button type="button" className="add-type-close" onClick={onCancel}>
                        &times;
                    </button>
                </div>

                {/* Body Message */}
                <p style={{ marginBottom: "1.25rem", color: "#555" }}>{message}</p>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                    <Button variant="secondary" type="button" onClick={onCancel}>
                        No, Cancel
                    </Button>
                    <Button variant="danger" type="button" onClick={onConfirm}>
                        Yes, Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;